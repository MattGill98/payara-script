package uk.me.mattgill.payara.tools.util;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.util.Properties;
import java.util.Set;
import java.util.function.BiConsumer;
import java.util.logging.Logger;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public final class ZipUtils {

    /**
     * Size of the buffer to read/write data
     */
    private static final int BUFFER_SIZE = 0x800;

    private static final Set<PosixFilePermission> POSIX_FILE_PERMISSIONS = PosixFilePermissions.fromString("rwxr-xr-x");

    private static final Logger LOGGER = Logger.getLogger(ZipUtils.class.getName());

    private ZipUtils() {
    }

    /**
     * Unzips a file to a specified directory. The specified directory should not
     * exist. Top level directories will be removed from the ZIP.
     * 
     * @param zipFile    the ZIP to extract.
     * @param extractDir the directory to extract the ZIP to.
     * @throws IOException           if an error occurs while extracting the ZIP.
     * @throws IllegalStateException if the extract directory already exists.
     */
    public static boolean unzip(File zipFile, File extractDir) {
        try {
            if (!zipFile.exists()) {
                throw new IllegalArgumentException("Specified ZIP doesn't exist");
            }
            if (extractDir.exists()) {
                throw new IllegalArgumentException("Directory to extract to already exists");
            }
            extractDir.mkdir();
            recurseZip(zipFile, true, (entry, inputStream) -> {
                try {
                    String entryName = entry.getComment() != null ? entry.getComment() : entry.getName();
                    File file = new File(extractDir, entryName);
                    if (entry.isDirectory()) {
                        file.mkdir();
                    } else {
                        file.createNewFile();
                        extractFile(inputStream, file.getAbsolutePath());
                    }
                } catch (IOException ex) {
                    throw new LambdaException(ex);
                }
            });
        } catch (Exception ex) {
            LOGGER.warning(String.format("Cannot extract zip %s to %s: %s.", zipFile, extractDir, ex.getMessage()));
            return false;
        }
        return true;
    }

    /**
     * Scans a ZIP to see if it's a valid Payara ZIP.
     * 
     * @return the version of the Payara ZIP, or null if no version was found.
     * @param zipFile the ZIP to scan.
     */
    public static String extractVersion(File zipFile) {
        StringBuilder versionBuilder = new StringBuilder();
        try {
            recurseZip(zipFile, false, (entry, inputStream) -> {
                try {
                    if (entry.getName().endsWith("glassfish-version.properties")) {
                        Properties props = new Properties();
                        props.load(inputStream);
                        String majorVersion = props.getProperty("major_version");
                        if (majorVersion != null && !majorVersion.isEmpty()) {
                            versionBuilder.append(majorVersion);
                        }
                        String minorVersion = props.getProperty("minor_version");
                        if (minorVersion != null && !minorVersion.isEmpty()) {
                            versionBuilder.append("." + minorVersion);
                        }
                        String updateVersion = props.getProperty("update_version");
                        if (updateVersion != null && !updateVersion.isEmpty()) {
                            versionBuilder.append("." + updateVersion);
                        }
                        String payaraVersion = props.getProperty("payara_version");
                        if (payaraVersion != null && !payaraVersion.isEmpty()) {
                            versionBuilder.append("." + payaraVersion);
                        }
                    }
                } catch (IOException ex) {
                    throw new LambdaException(ex);
                }
            });
        } catch (Exception ex) {
            LOGGER.warning(String.format("Cannot read from zip %s: %s.", zipFile, ex.getMessage()));
        }

        String version = versionBuilder.toString();
        if (version == null || version.isEmpty()) {
            LOGGER.warning("Version not found in Payara archive.");
            return null;
        }
        return version.toString();
    }

    private static void recurseZip(File zipFile, boolean removeTopLevelDirectory,
            BiConsumer<ZipEntry, ZipInputStream> consumer) throws IOException {
        try (ZipInputStream zipIn = new ZipInputStream(new FileInputStream(zipFile))) {
            ZipEntry entry = zipIn.getNextEntry();
            if (entry != null) {
                final String topLevelDirectory;
                if (removeTopLevelDirectory && entry.getName().endsWith("/")) {
                    topLevelDirectory = entry.getName();
                } else {
                    topLevelDirectory = null;
                }
                if (topLevelDirectory == null) {
                    consumer.accept(entry, zipIn);
                }
                zipIn.closeEntry();
                // iterates over entries in the zip file
                while ((entry = zipIn.getNextEntry()) != null) {
                    if (topLevelDirectory != null) {
                        entry.setComment(entry.getName().replace(topLevelDirectory, ""));
                    }
                    consumer.accept(entry, zipIn);
                    zipIn.closeEntry();
                }
            }
        }
    }

    private static void extractFile(ZipInputStream zipIn, String filePath) throws IOException {
        File file = new File(filePath);
        BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(file));
        byte[] bytesIn = new byte[BUFFER_SIZE];
        int read = 0;
        while ((read = zipIn.read(bytesIn)) != -1) {
            bos.write(bytesIn, 0, read);
        }
        bos.close();
        if (filePath.contains("bin/") || filePath.contains("lib/")) {
            file.setExecutable(true);
            Files.setPosixFilePermissions(file.toPath(), POSIX_FILE_PERMISSIONS);
        }
    }
}