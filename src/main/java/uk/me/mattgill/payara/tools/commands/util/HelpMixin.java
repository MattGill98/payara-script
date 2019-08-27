package uk.me.mattgill.payara.tools.commands.util;

import picocli.CommandLine;
import picocli.CommandLine.Command;

public class HelpMixin {

    @Command(name = "help", description = "Print usage for this command.")
    public void prompt() {
        CommandLine.usage(this, System.out);
    }
}