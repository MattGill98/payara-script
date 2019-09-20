package uk.me.mattgill.payara.tools.commands;

import java.util.logging.Logger;

import javax.inject.Inject;

public abstract class CustomCommand implements Runnable {

    @Inject
    protected Logger logger;
}