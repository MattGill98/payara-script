package uk.me.mattgill.payara.tools.commands;

import static uk.me.mattgill.payara.tools.util.PayaraUtils.killDomain;

import picocli.CommandLine.Command;

@Command(name = "kill", description = "Kills the active Payara package.")
public class Kill extends CustomCommand {

    @Override
    public void run() {
        if (killDomain()) {
            logger.info("Killed Payara.");
        } else {
            logger.warning("Payara wasn't running.");
        }
    }

}