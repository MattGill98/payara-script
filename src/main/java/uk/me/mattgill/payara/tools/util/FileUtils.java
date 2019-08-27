package uk.me.mattgill.payara.tools.util;

import java.io.File;
import java.io.IOException;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;

public final class FileUtils {

    private FileUtils() {
    }

    /**
     * Moves a file or directory from one place to another.
     * 
     * @param from the file to move.
     * @param to   the location to move the file to.
     * @throws IOException if the target file already exists.
     */
    public static void move(File from, File to) throws IOException {
        if (to.exists() && to.isFile()) {
            throw new IOException("File already exists.");
        }
        Files.move(from.toPath(), to.toPath());
    }

    /**
     * Copies a file or directory from one place to another.
     * 
     * @param from the file to copy.
     * @param to   the location to copy the file to.
     * @throws IOException if the target file already exists.
     */
    public static void copy(File from, File to) throws IOException {
        if (to.exists() && to.isFile()) {
            throw new IOException("File already exists.");
        }
        Files.copy(from.toPath(), to.toPath());
    }

    /**
     * Deletes a file or directory.
     * 
     * @param file the file to delete.
     * @throws IOException if an error occurs while deleting the file.
     */
    public static void delete(File file) throws IOException {
        if (!file.exists()) {
            return;
        }
        if (file.isDirectory()) {
            Files.walkFileTree(file.toPath(), new SimpleFileVisitor<Path>() {
                @Override
                public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                    Files.delete(file);
                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult postVisitDirectory(Path dir, IOException exc) throws IOException {
                    Files.delete(dir);
                    return FileVisitResult.CONTINUE;
                }
            });
        } else {
            Files.delete(file.toPath());
        }
    }

}