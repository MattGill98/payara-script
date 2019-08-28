package uk.me.mattgill.payara.tools.commands;


import java.io.IOException;
import java.util.logging.Level;

import picocli.CommandLine.Command;
import picocli.CommandLine.Unmatched;

@Command(name = "asadmin", description = "Runs an asadmin command on Payara.")
public class Asadmin extends PackageCommand {

    @Unmatched
    private String[] args;

    @Override
    public void runCommand() {
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

}