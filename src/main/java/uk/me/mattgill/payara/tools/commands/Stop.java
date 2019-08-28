package uk.me.mattgill.payara.tools.commands;

import picocli.CommandLine.Command;

@Command(name = "stop", description = "Stops the active Payara package.")
public class Stop extends Asadmin {

    @Override
    public void runCommand() {
        asadmin("stop-domain");
    }

}