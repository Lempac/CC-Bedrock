import {Player, system } from "@minecraft/server"
import  { FormCancelationReason, ModalFormData, ModalFormResponse } from "@minecraft/server-ui"

export interface Directory {
    name: string
    type: "Directory"
    directories: Directory[]
    files: File[]
}

export interface File {
    name: string
    type: "File"
    content: string
}

export interface FileError {
    type: "FileError",
    error: string
}

console.warn = console.log

export const FileSystem = {
    directoryTree: (directory: Directory, depth: number = 0): string => {
        let text = `§3${directory.name}/§r`;

        for (let i = 0; i < directory.directories.length; i++) {
            const dir = directory.directories[i];
            const pipe = (i == directory.directories.length - 1 && directory.files.length == 0) ? "└" : "├";
            text += `\n${" │ ".repeat(depth)} ${pipe} ${FileSystem.directoryTree(dir, depth + 1)}`
        }

        for (let i = 0; i < directory.files.length; i++) {
            const pipe = i == directory.files.length - 1 ? "└" : "├";
            text += `\n${" │ ".repeat(depth)} ${pipe} ${directory.files[i].name}`
        }

        if (depth == 0) return `\n${text}`
        else return text;
    },

    resolveDirectory: (root: Directory, path: string[]): Directory | FileError => {
        let current: Directory = root;

        for (let i = 0; i < path.length; i++) {
            const newPath = current.directories.find(dir => dir.name == path[i])
            if (newPath === undefined) return { type: "FileError", error: `Directory §3${current.name}§r does not contain §3${path[i]}§r` }
            current = newPath;
        }

        return current;
    },

    makeDirectory: (dir: Directory, path: string[], dirName: string): Directory | FileError => {
        path = [...path]
        if (path.length > 0) {
            const index = dir.directories.findIndex(f => f.name == path.shift());
            const result = FileSystem.makeDirectory(dir.directories[index], path, dirName)
            if (result.type == "FileError") return result;
            dir.directories[index] = result;
            return dir
        }

        // Check it doesnt already exist
        if (dir.directories.find(f => f.name == dirName)) return { type: "FileError", error: `${dirName} already exists!` };

        // Create the new directory and return an instance
        dir.directories.push({
            type: "Directory",
            name: dirName,
            files: [],
            directories: []
        });
        return dir;
    },

    deleteDirectory: (dir: Directory, path: string[], dirName: string): Directory | FileError => {
        path = [...path]
        if (path.length > 0) {
            const index = dir.directories.findIndex(f => f.name == path.shift());
            const result = FileSystem.deleteDirectory(dir.directories[index], path, dirName)
            if (result.type == "FileError") return result;
            dir.directories[index] = result;
            return dir
        }

        const dirIndex = dir.directories.findIndex(f => f.name == dirName);
        if (dirIndex == -1) return { type: "FileError", error: `directory ${dirName} does not exist!` };
        dir.directories.splice(dirIndex, 1)
        return dir;
    },

    writeFile: (dir: Directory, path: string[], fileName: string, content: string): Directory | FileError => {
        path = [...path]
        if (path.length > 0) {
            const index = dir.directories.findIndex(f => f.name == path.shift());
            const result = FileSystem.writeFile(dir.directories[index], path, fileName, content)
            if (result.type == "FileError") return result;
            dir.directories[index] = result;
            return dir
        }

        const fileIdx = dir.files.findIndex(f => f.name == fileName);
        if (fileIdx == -1) return { type: "FileError", error: `${fileIdx} does not exist!` };

        dir.files[fileIdx].content = content;
        return dir;
    },

    readFile: (dir: Directory, path: string[], fileName: string): Directory | File | FileError => {
        path = [...path]
        if (path.length > 0) {
            const index = dir.directories.findIndex(f => f.name == path.shift());
            const result = FileSystem.readFile(dir.directories[index], path, fileName)
            if (result.type == "FileError") return result;
            dir.directories[index] = result as Directory;
            return dir
        }

        const file = dir.files.find(f => f.name == fileName);
        if (file == undefined) return { type: "FileError", error: `${fileName} does not exist` }
        return file;
    },

    deleteFile: (dir: Directory, path: string[], fileName: string): Directory | FileError => {
        path = [...path]
        if (path.length > 0) {
            const index = dir.directories.findIndex(f => f.name == path.shift());
            const result = FileSystem.deleteFile(dir.directories[index], path, fileName)
            if (result.type == "FileError") return result;
            dir.directories[index] = result;
            return dir
        }

        const dirIndex = dir.files.findIndex(f => f.name == fileName);
        if (dirIndex == -1) return { type: "FileError", error: `file ${fileName} does not exist!` };
        dir.files.splice(dirIndex, 1)
        return dir;
    },

    makeFile: (dir: Directory, path: string[], fileName: string): Directory | FileError => {
        path = [...path]
        if (path.length > 0) {
            const index = dir.directories.findIndex(f => f.name == path.shift());
            const result = FileSystem.makeFile(dir.directories[index], path, fileName)
            if (result.type == "FileError") return result;
            dir.directories[index] = result;
            return dir;
        }

        // Check it doesnt already exist
        if (dir.files.find(f => f.name == fileName)) return { type: "FileError", error: `${fileName} already exists!` };

        // Create the new directory and return an instance
        dir.files.push({
            type: "File",
            name: fileName,
            content: ""
        });
        return dir;
    },

    sleep: (ms: number) => {
        return new Promise(resolve => system.runTimeout(resolve, ms * 1));
    },

    openFile: async (player: Player, fileName: string, content: string) => {
        let res = undefined;
        while (res == undefined || res?.cancelationReason == FormCancelationReason.UserBusy) {
            await FileSystem.sleep(10);
            const modal = new ModalFormData()
                .title(fileName)
                .textField("Paste your file:", "", "");
            res = await modal.show(player);
        }
        return (res.formValues ?? [])[0];
    }
}
