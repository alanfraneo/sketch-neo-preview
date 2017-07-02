var FSUtil = { };

FSUtil.createFolder = function (path) {
	var fileManager = NSFileManager.defaultManager();

	fileManager.createDirectoryAtPath_withIntermediateDirectories_attributes_error_(path, true, nil, nil);
};

FSUtil.deleteFolder = function (path) {
	var fileManager = NSFileManager.defaultManager();

	fileManager.removeItemAtPath_error(path, nil);
};

FSUtil.deleteAndCreateFolder = function (path) {
	FSUtil.deleteFolder(path);
	FSUtil.createFolder(path);
};
