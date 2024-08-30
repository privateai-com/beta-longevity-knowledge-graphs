import * as XLSX from 'xlsx';
import { useCallback } from "react";
import { Button } from '../../../../components/Button';
import { ProfileButton } from '../../../../components/ProfileButton';
import styles from './styles.module.scss'
import Typography from '../../../../components/Typography';
import { fullTimeFormatter } from '../../../../hooks/dataTimeFormater';

export const exportToExcel = (data, title) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
};

export const convertToBytesString = (num) => {
    if (num >= 1) {
      return `${num.toFixed(2)} MB`;
    } 
    return `${(num * 1024).toFixed(2)} KB`;
  };
  

export const FileInfo = ({data}) => {

    const onDownloadXlsxClick = useCallback(() => {

        const graphs = (data.graphDraft && data.graphDraft.length) > 0 ? data.graphDraft : data.graph

        if (data) exportToExcel(graphs, data.title);
      }, [data]);

    return <>
        <section className={styles.wrap}>
            {/* <h2>
                File info
            </h2> */}
            <div className={styles.wrap_inner}>
                <div className={styles.row}>
                    <Typography type='h1'>
                        {data.title}
                    </Typography>
                    <Button
                        onClick={onDownloadXlsxClick}
                    >
                        Export
                    </Button>
                </div>
                <div className="">
                    <ProfileButton 
                        id={data.owner.id}
                        username={data.owner.username || 'Anonymous'}
                    />
                </div>
                <div className={styles.table_table}>
                    <div className={styles.table_row}>
                        <div className={styles.table_col}>
                            <Typography type='h3'>
                                Core entries:
                            </Typography>
                        </div>
                        <div className={styles.table_col}>
                            <Typography type='span'>
                                {data.topCoreEntities}
                            </Typography>
                        </div>
                    </div>
                    <div className={styles.table_row}>
                        <div className={styles.table_col}>
                            <Typography type='h3'>
                                Topic:
                            </Typography>
                        </div>
                        <div className={styles.table_col}>
                            <Typography type='span'>
                                {data.field || "Empty field"}
                            </Typography>
                        </div>
                    </div>
                    <div className={styles.table_row}>
                        <div className={styles.table_col}>
                            <Typography type='h3'>
                                Created:
                            </Typography>
                        </div>
                        <div className={styles.table_col}>
                            <Typography type='span'>
                                {fullTimeFormatter(data.createdAt)}
                                {/* {data.createdAt} */}
                            </Typography>
                        </div>
                    </div>
                    <div className={styles.table_row}>
                        <div className={styles.table_col}>
                            <Typography type='h3'>
                                Modified:
                            </Typography>
                        </div>
                        <div className={styles.table_col}>
                            <Typography type='span'>
                                {fullTimeFormatter(data.updatedAt)}
                            </Typography>
                        </div>
                    </div>
                    <div className={styles.table_row}>
                        <div className={styles.table_col}>
                            <Typography type='h3'>
                                Data Size:
                            </Typography>
                        </div>
                        <div className={styles.table_col}>
                            <Typography type='span'>
                                {convertToBytesString(data.fileSize)}
                            </Typography>
                        </div>
                    </div>
                </div>
                {/* <p>
                    {data.topCoreEntities}
                </p> */}
                
            </div>
        </section>
    </>
}

