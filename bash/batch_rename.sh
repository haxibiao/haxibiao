#!/bin/bash

#执行之前，打印出来命令
set -x

src_root="/data/code/haxibiao/src"

cd $src_root

echo "重命名ts 文件夹 components"
for folder in ./components/*;
do
	if [ -d ${folder} ]; then
	cd ${folder}

    for file in *.js;
    do
		if [ '*.js'!="$file" ]; then
        	mv $file ${file/.js/.tsx};
		fi
    done

	cd $src_root
	fi
done


echo "重命名ts 文件夹 screens"
for folder in ./screens/*;
do
	if [ -d ${folder} ]; then
	cd ${folder}
    
	for file in *.js;
    do
		if [ '*.js'!="$file" ]; then
        	mv $file ${file/.js/.tsx};
		fi
    done

	cd $src_root
	fi
done


echo "重命名ts 文件夹 screens 下子文件夹..."
for folder in ./screens/*/*;
do
	if [ -d ${folder} ]; then
	cd ${folder}
    
	for file in *.js;
    do
		if [ '*.js'!="$file" ]; then
        	mv $file ${file/.js/.tsx};
		fi
    done

	cd $src_root
	fi
done