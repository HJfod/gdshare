const GDShare = {
    exportPath: "",
    imports: "",
    export(level = false) {
        ipcSend({ 
            action: "level-export",
            from: false,
            path: this.exportPath,
            levels: level ? level : document.querySelector("#level-list").getValue()
        });
    },
    import(level = false) {
        const imp = []; 
        
        ipcSend({ 
            action: "level-import",
            to: false,
            levels: imp
        });
    },
    selectExportPath() {
        ipcSend({
            action: "select-path",
            title: "Select export path",
            dir: true,
            returnCode: "export-path"
        });
    },
    setExportPath(to) {
        this.exportPath = to;
        document.getElementById("export-path").innerHTML = to;
    }
};