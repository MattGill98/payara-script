package uk.me.mattgill.payara.tools.commands;

import picocli.CommandLine.Command;

@Command(name = "start", description = "Starts the active Payara package.")
public class Start extends Asadmin {

    @Override
    public void runCommand() {
        asadmin("start-domain");
    }

}