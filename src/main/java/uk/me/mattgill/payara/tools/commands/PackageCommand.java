package uk.me.mattgill.payara.tools.commands;


import javax.annotation.Nullable;
import javax.inject.Inject;

import uk.me.mattgill.payara.tools.config.AppConfig;
import uk.me.mattgill.payara.tools.install.Package;

public abstract class PackageCommand extends CustomCommand {

    @Inject
    protected AppConfig config;

    @Inject
    @Nullable
    protected Package activePackage;

    @Override
    public final void run() {
        if (validateConfiguration()) {
            runCommand();
        }
    }

    public abstract void runCommand();

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