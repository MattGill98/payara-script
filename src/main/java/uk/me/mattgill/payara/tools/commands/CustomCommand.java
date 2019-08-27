package uk.me.mattgill.payara.tools.commands;

import java.util.logging.Logger;

import javax.inject.Inject;

import uk.me.mattgill.payara.tools.commands.util.HelpMixin;

public abstract class CustomCommand implements Runnable {

    protected HelpMixin help = new HelpMixin();

    @Inject
    protected Logger logger;
}