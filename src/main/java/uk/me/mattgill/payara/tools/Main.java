package uk.me.mattgill.payara.tools;

import java.io.IOException;
import java.io.InputStream;
import java.util.logging.LogManager;

import picocli.CommandLine;
import picocli.CommandLine.Command;
import picocli.CommandLine.IFactory;
import uk.me.mattgill.payara.tools.commands.Asadmin;
import uk.me.mattgill.payara.tools.commands.Install;
import uk.me.mattgill.payara.tools.commands.Kill;
import uk.me.mattgill.payara.tools.commands.Reset;
import uk.me.mattgill.payara.tools.commands.Set;
import uk.me.mattgill.payara.tools.commands.Start;
import uk.me.mattgill.payara.tools.commands.Status;
import uk.me.mattgill.payara.tools.commands.Stop;
import uk.me.mattgill.payara.tools.config.AppConfig;
import uk.me.mattgill.payara.tools.inject.CommandFactory;

@Command(name = "payara",
        subcommands = {
            Asadmin.class,
            Status.class,
            Install.class,
            Set.class,
            Start.class,
            Stop.class,
            Kill.class,
            Reset.class
        })
public class Main implements Runnable {

    public static void main(String[] args) throws IOException {

        // Configure logging
        try (InputStream loggingPropertiesStream = Main.class.getClassLoader().getResourceAsStream("logging.properties")) {
            LogManager.getLogManager().readConfiguration(loggingPropertiesStream);
        }

        // Start console
        try (AppConfig config = new AppConfig()) {
            IFactory commandFactory = new CommandFactory(config);
            CommandLine.run(Main.class, commandFactory, args);
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
        }
    }

    @Override
    @Command(name = "help", description = "Print usage for this utility.")
    public void run() {
        CommandLine.usage(this, System.out);
    }

}