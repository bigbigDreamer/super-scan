#!/usr/bin/env node
const { program } = require('commander');
const fs = require('fs');
const ora = require('ora');
const chalk = require('chalk');
const { superScan } = require('./lib');
const { parseLessVariable } = require('./lib/parse');
const config = require('./ss.config.js') || {};

const spinner = ora('Read config from file and shell');


async function run(source, compileLib) {
    spinner.start();
    const  startTime = Date.now()

    let test = 'less';
    const ssAnalysis = {
        total: 0,
        success: 0,
        fail: 0
    };

    if (!source) { source = config.source }
    if (!compileLib) { compileLib = config.compileLib }

    test = config.test

    try {
        const lessConfigObj = parseLessVariable(source);
        spinner.succeed('Read config success！Start scan！')
        superScan({
            filePath: compileLib,
            test,
            onSuccess: (data, fileDir) => {
                ssAnalysis.total+=1;
                let newData = data;
                Object.keys(lessConfigObj).forEach(item => {
                    const regx = new RegExp(lessConfigObj[item], 'g')
                    if (regx.test(newData)) {
                        newData = newData.replace( regx, item);
                    }
                });

                if (newData) {
                    spinner.start('Start overwrite source file！')
                    fs.writeFile(fileDir, newData, {},(err) => {
                        if (err) {
                            spinner.fail(`File: ${chalk.redBright(`${fileDir}`)} overwrite fail, view detail err`);
                            ssAnalysis.fail+=1;
                            return;
                        }
                        ssAnalysis.success+=1;
                        spinner.succeed(`File: ${chalk.greenBright(`${fileDir}`)} overwrite successfully，please review！`)

                        if (ssAnalysis.fail + ssAnalysis.success === ssAnalysis.total) {
                            console.log(chalk.green(`
                                        GOOD JOB！！！
                                        
                                           X
                                        YYYYYYY
                                      N777777777NO
                                    N7777777777777N
                                     DNNM$$$$777777N                              D
                                    N$N:=N$777N7777M                             NZ
                                   77Z::::N777777777                          ODZZZ
                                   D=::::::::::N7777777777N                    777
                                  INN===::::::=77777777777N                  I777N
                                 ?777N========N7777777777787M               N7777
                                 77777$D======N77777777777N777N?         N777777
                                I77777$$$N7===M$$77777777$77777777$MMZ77777777N
                                 $$$$$$$$$$$NIZN$$$$$$$$$M$$7777777777777777ON
                                  M$$$$$$$$M    M$$$$$$$$N=N$$$$7777777$$$ND
                                 O77Z$$$$$$$     M$$$$$$$$MNI==$DNNNNM=~N
                              7 :N MNN$$$$M$      $$$777$8      8D8I
                                NMM.:7O           777777778
                                                  M   :   M
                                                       8
   
                                The Files: ${chalk.blue(`Total(${ssAnalysis.total})`)}, Success(${ssAnalysis.success}), ${chalk.red(`Fail(${ssAnalysis.fail})`)}
                            `))

                            console.log(Date.now() - startTime+'s')
                        }
                    })
                }
            }
        });

    } catch (e) {
        spinner.fail(`解析出错! ${e.toString()}`)
    }
}


async function main() {

    program.version('0.0.1');

    program
        .command('with <source> [compileLib]')
        .description('ss-cli with config to compile dir')
        .action(run)
    await program.parseAsync(process.argv);
}

main().catch(err => console.error(err));
