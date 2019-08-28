package uk.me.mattgill.payara.tools.commands;

import static java.util.logging.Level.WARNING;

import java.io.IOException;

import picocli.CommandLine.Command;

@Command(name = "reset", description = "Resets the active Payara package.")
public class Reset extends PackageCommand {

    @Override
    public void runCommand() {
        try {
            activePackage.reset();
        } catch (IOException ex) {
            logger.log(WARNING, "Error resetting the Package.", ex);
		}
    }

}