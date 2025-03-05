import React from 'react';
import { Button, Empty, Typography } from 'antd';
const EmptyTable = ({ sheetURL }) => (
    <div className='flex justify-center items-center h-[70vh]'>
        <div className='flex-col justify-center items-center'>
            <div className='flex justify-center items-center'>
                <img src='https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'
                    styles={{
                        image: {
                            height: 60,
                        },
                    }}
                />
            </div>
            <div className='flex justify-center items-center my-[20px]'>
                <span>
                    No data found, your <a href={sheetURL} target="_blank">Spreadsheet</a> is empty
                </span>
            </div>
            <div className='flex justify-center items-center'>
                <Button href={sheetURL} target="_blank" type="primary">Open Spreadsheet</Button>
            </div>
        </div>
    </div>
);
export default EmptyTable;