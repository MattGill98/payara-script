package uk.me.mattgill.payara.tools.commands;

import javax.inject.Inject;

import picocli.CommandLine.Command;
import uk.me.mattgill.payara.tools.install.Package;
import uk.me.mattgill.payara.tools.install.Packages;

@Command(name = "status", description = "Prints the status of the packages.")
public class Status extends CustomCommand {

    @Inject
    private Packages packages;

    @Override
    public void run() {
        if (packages == null) {
            logger.warning("The installation directory hasn't been configured.");
        }
        // Print the installation directory
        logger.info("Install Directory: " + packages.getDirectory());

        if (packages.getAll().isEmpty()) {
            logger.info("No packages found.");
            return;
        }

        logger.info("Available Payara packages:");
        for (Package pkg : packages.getAll()) {
            String resultLine = pkg.getName();
            if (pkg.isActive()) {
                resultLine += " (active)";
            }
            if (pkg.isRunning()) {
                resultLine += " (running)";
            }
            logger.info(resultLine);
        }
    }

}