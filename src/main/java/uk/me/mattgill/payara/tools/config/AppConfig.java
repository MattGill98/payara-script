package uk.me.mattgill.payara.tools.config;

import static uk.me.mattgill.payara.tools.config.validation.AppConfigValidation.validatePackagesDirectory;

import java.io.File;
import java.io.IOException;

import uk.me.mattgill.payara.tools.config.validation.ValidationException;

public class AppConfig extends FileConfig {

    private static final File CONFIG_FILE = new File(System.getProperty("user.home"), ".payaraconfig");

    private static final String PACKAGES_DIR = "payara.install.dir";
    private static final String ACTIVE_PACKAGE = "payara.active";

    private static final String NEXUS_USERNAME = "nexus.username";
    private static final String NEXUS_PASSWORD = "nexus.password";

    public AppConfig() throws IOException {
        super(CONFIG_FILE);
    }

    public File getPackagesDirectory() {
        return new File(setIfAbsent(PACKAGES_DIR, new File(CONFIG_FILE.getParent(), "payara/").toString()));
    }

    public void setPackagesDirectory(File installDir) throws ValidationException {
        validatePackagesDirectory(installDir);
        set(PACKAGES_DIR, installDir.getAbsolutePath());
    }

    public String getActivePackage() {
        return get(ACTIVE_PACKAGE);
    }

    public void setActivePackage(String configName) {
        set(ACTIVE_PACKAGE, configName);
    }

    public String getNexusUsername() {
        return get(NEXUS_USERNAME);
    }

    public void setNexusUsername(String username) {
        set(NEXUS_USERNAME, username);
    }

    public String getNexusPassword() {
        return get(NEXUS_PASSWORD);
    }

    public void setNexusPassword(String password) {
        set(NEXUS_PASSWORD, password);
    }

}