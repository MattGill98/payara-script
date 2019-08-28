package uk.me.mattgill.payara.tools.commands;

import org.apache.commons.io.input.Tailer;
import org.apache.commons.io.input.TailerListener;

import picocli.CommandLine.Command;

@Command(name = "log", description = "Tails the Payara server log.")
public class Log extends PackageCommand {

    @Override
    public void runCommand() {
        new Tailer(activePackage.getServerLog(), new TailerListener(){
            @Override
            public void init(Tailer tailer) {
                logger.info("Trailing server log...");
            }
        
            @Override
            public void handle(Exception ex) {
                logger.severe(ex.getMessage());
            }
        
            @Override
            public void handle(String line) {
                logger.info(line);
            }
        
            @Override
            public void fileRotated() {
                logger.info("Server log rotated.");
            }
        
            @Override
            public void fileNotFound() {
                logger.info("Server log not found.");
            }
        }).run();
    }

}