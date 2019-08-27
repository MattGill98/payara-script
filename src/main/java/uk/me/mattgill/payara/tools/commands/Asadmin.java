package uk.me.mattgill.payara.tools.commands;


import java.io.IOException;
import java.util.logging.Level;

import javax.annotation.Nullable;
import javax.inject.Inject;

import picocli.CommandLine.Command;
import picocli.CommandLine.Unmatched;
import uk.me.mattgill.payara.tools.config.AppConfig;
import uk.me.mattgill.payara.tools.install.Package;

@Command(name = "asadmin", description = "Runs an asadmin command on Payara.")
public class Asadmin extends CustomCommand {

    @Inject
    private AppConfig config;

    @Inject
    @Nullable
    private Package activePackage;

    @Unmatched
    private String[] args;

    @Override
    public void run() {
        validateConfiguration();
        asadmin(args);
    }

    protected void asadmin(String... args) {
        logger.info("Selected install: " + activePackage.getName());
        try {
            activePackage.asadmin(args);
        } catch (IOException ex) {
            logger.log(Level.WARNING, "Asadmin command failed.", ex);
        }
    }

    protected boolean validateConfiguration() {
        boolean valid = true;
        if (config.getPackagesDirectory() == null) {
            logger.warning("The installation directory hasn't been configured.");
            valid = false;
        }
        if (activePackage == null || !activePackage.isValid()) {
            logger.warning("No package has been configured.");
            valid = false;
        }
        return valid;
    }

}