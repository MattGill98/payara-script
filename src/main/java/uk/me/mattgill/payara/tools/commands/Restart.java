package uk.me.mattgill.payara.tools.commands;

import picocli.CommandLine.Command;

@Command(name = "restart", description = "Restarts the active Payara package.")
public class Restart extends Asadmin {

    @Override
    public void runCommand() {
        asadmin("stop-domain");
        asadmin("start-domain");
    }

}