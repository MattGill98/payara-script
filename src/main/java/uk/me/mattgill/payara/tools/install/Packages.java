package uk.me.mattgill.payara.tools.install;

import static uk.me.mattgill.payara.tools.util.FileUtils.copy;
import static uk.me.mattgill.payara.tools.util.FileUtils.delete;
import static uk.me.mattgill.payara.tools.util.ZipUtils.extractVersion;
import static uk.me.mattgill.payara.tools.util.ZipUtils.unzip;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.logging.Logger;

public final class Packages {

    private static final Logger LOGGER = Logger.getLogger(Packages.class.getName());

    private final File packagesDirectory;

    private final Collection<Package> packages;

    private Package activePackage;

    public Packages(File packagesDirectory, String activePackage) {
        this.packagesDirectory = packagesDirectory;
        this.packages = new ArrayList<>();
        
        if (packagesDirectory != null && packagesDirectory.exists() && packagesDirectory.isDirectory()) {
            File[] subDirectories = packagesDirectory.listFiles(file -> file.isDirectory());
    
            for (int i = 0; i < subDirectories.length; i++) {
                File subDirectory = subDirectories[i];
                Package installedPackage = new Package(subDirectory, subDirectory.getName().equals(activePackage));
                if (installedPackage.isValid()) {
                    packages.add(installedPackage);
                    if (installedPackage.isActive()) {
                        this.activePackage = installedPackage;
                    }
                }
            }
        }
    }

    public File getDirectory() {
        return packagesDirectory;
    }

    public Package getActivePackage() {
        return activePackage;
    }

    public Package install(File pkg, String version) throws IOException, IllegalArgumentException {
        if (pkg == null || !pkg.exists()) {
            throw new IllegalArgumentException("Package at " + pkg + " didn't exist.");
        }

        File outputDirectory = null;
        try {

            // Get version of package
            if (version == null) {
                version = extractVersion(pkg);
                System.out.println("Version found: " + version);
            }

            // Create new folder for install
            outputDirectory = new File(packagesDirectory, version);
            outputDirectory.mkdir();
            Package newPackage = new Package(outputDirectory, false);

            // Copy the install zip to the new folder
            copy(pkg, newPackage.getZip());
            unzip(newPackage.getZip(), newPackage.getExtractDir());

            System.out.println("Installed " + pkg + " to "
                    + ((outputDirectory == null) ? "null" : outputDirectory.getAbsolutePath()));
            return newPackage;
        } catch (IOException ex) {
            LOGGER.warning(ex.getMessage());
        }
        return null;
    }

    public Package install(File pkg) throws IOException, IllegalArgumentException {
        return install(pkg, null);
    }

    public Package uninstall(String packageName) throws IOException, IllegalArgumentException {
        Iterator<Package> packageIterator = packages.iterator();
        while (packageIterator.hasNext()) {
            Package pkg = packageIterator.next();
            if (pkg.getName().equals(packageName)) {
                packageIterator.remove();
                delete(pkg.getRootDir());
                return pkg;
            }
        }
        throw new IllegalArgumentException("Package with given name doesn't exist.");
    }

    public Collection<Package> getAll() {
        return packages;
    }

}