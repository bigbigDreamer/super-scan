const fs = require('fs');
const path = require('path');
const { resolve } = require('./utils');

const parseLess = file => fs.readFileSync(file).toString();

/**
 * @desc 获取文件信息状态
 * @param fileDir
 * @param onError
 * @param onSuccess
 */
const getFileStat = ({ fileDir, onError, onSuccess }) => {
    fs.stat(fileDir,function(err,stats){
        if(err){ onError(err); return; }
        /** 文件 */
        const isFile = stats.isFile();
        /** 文件夹 */
        const isDir = stats.isDirectory();

        onSuccess({ isFile, isDir });
    })
};

/**
 * @desc 递归扫描文件
 * @param filePath
 * @param onSuccess
 * @param test
 */
const superScan = ({ filePath, onSuccess, test }) => {
    filePath = resolve(filePath);

    const testRegRules = Array.isArray(test) ? test.join('|') : test;
    const testReg = new RegExp(`.(${testRegRules})`)

    fs.readdir(filePath,function(err,files){
        if(err) {
            console.warn("读取文件夹出错：", err);
            return;
        }
        //遍历读取到的文件列表
        files.forEach(function(filename){

            //获取当前文件的绝对路径
            const fileDir = path.join(filePath,filename);

            getFileStat({
                fileDir,
                onError: () => console.warn('获取文件stats失败'),
                onSuccess: ({ isFile, isDir }) => {
                    if(isFile){
                        if (testReg.test(fileDir)) {
                            onSuccess(parseLess(fileDir), fileDir);
                        } else {
                            // console.warn('非 less 文件')
                        }
                    }

                    // 递归遍历
                    if(isDir){
                        superScan({ filePath: fileDir, onSuccess, test });//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                    }
                }
            });
        });

    });
};


module.exports = {
    superScan
}

