package uk.me.mattgill.payara.tools.install;

import static java.util.Arrays.asList;
import static uk.me.mattgill.payara.tools.util.FileUtils.delete;
import static uk.me.mattgill.payara.tools.util.PayaraUtils.isDomainRunning;
import static uk.me.mattgill.payara.tools.util.PayaraUtils.killDomain;
import static uk.me.mattgill.payara.tools.util.ZipUtils.unzip;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class Package {

    private final boolean active;

    private final File rootDir;
    private final File zip;
    private final File extractDir;
    private final File asadmin;
    private final File domainDir;
    private final File serverLog;

    public Package(File packageDir, boolean active) {
        this.rootDir = packageDir;
        this.active = active;
        this.zip = new File(rootDir, "payara.zip");
        this.extractDir = new File(rootDir, "appserver/");
        this.asadmin = new File(extractDir, "bin/asadmin");
        this.domainDir = new File(extractDir, "glassfish/domains/domain1");
        this.serverLog = new File(domainDir, "logs/server.log");
    }

    public boolean isValid() {
        return zip.exists() &&
                extractDir.exists() &&
                extractDir.isDirectory() &&
                asadmin.exists() &&
                asadmin.isFile();
    }

    public boolean isActive() {
        return active;
    }

    public boolean isRunning() {
        return isDomainRunning(domainDir);
    }

    public void uninstall() throws IOException {
        killDomain();
        delete(rootDir);
    }

    public void reset() throws IOException {
        killDomain();
        delete(extractDir);
        initialize();
    }

    public void initialize() throws IOException {
        unzip(zip, extractDir);
    }

    public void asadmin(String... args) throws IOException {
        // Build command to run
        List<String> commands = new ArrayList<>();
        commands.add(asadmin.getAbsolutePath());
        commands.addAll(asList(args));

        // Build process
        ProcessBuilder process = new ProcessBuilder(commands).inheritIO();

        // Start process
        try {
            process.start().waitFor();
        } catch (InterruptedException ex) {
            throw new IOException("Process interrupted.", ex);
        }
    }

    public String getName() {
        return rootDir.getName();
    }

    public File getRootDir() {
        return rootDir;
    }

    public File getZip() {
        return zip;
    }

    public File getExtractDir() {
        return extractDir;
    }

    public File getServerLog() {
        return serverLog;
    }

}