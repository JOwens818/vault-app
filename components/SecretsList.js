import React, { useEffect, useState } from 'react';
import { fetcher } from 'lib/apiFetcher';
import { useRouter } from "next/router";
import SessionExpired from './SessionExpired';
import { 
  Button,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  TableSelectRow,
  Tile,
  DataTableSkeleton,
  TableToolbarAction,
  TableToolbarMenu
} from '@carbon/react';
import { Download } from '@carbon/react/icons';
	

const SecretsList = (props) => {
	
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [secretList, setSecretList] = useState([]);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await getSecretList();
    }
    initialize();
  }, []);


  const getSecretList = async () => {
    setLoading(true);
    setError(false);
    setSecretList([]);

    const secretListResp = await fetcher("getSecretList", "/api/secrets/list", "GET");
    if (secretListResp.status === "fail") {
      setSessionExpired(true);
    }
    
    if (secretListResp.status === "error") {
      setError(true);
    } else {
      setSecretList(secretListResp.data);
    }
    setLoading(false);
  }

  
  const getLabel = (selectedRow) => {
    
    if (selectedRow.length === 0) {
      return "Please select a secret";
    }

    let label;
    secretList.forEach(s => {
      if (s.id === selectedRow[0].id) {
        label = s.Secret;
      }
    });
    return label;
  }
  
  return (
    <>
      { loading ? (
          <DataTableSkeleton />
        ) : (
          <>
            { sessionExpired && ( <SessionExpired /> ) }

            { error && ( <Tile><h4>Error Retrieving Secrets...</h4></Tile> ) }
          
            { !error && secretList && secretList.length === 0 && ( <Tile><h4>No secrets found</h4></Tile> ) }

            { !error && secretList && secretList.length > 0 && (
              <div className='topMargin'>
                <DataTable
                  radio
                  useZebraStyles={true}
                  rows={secretList}
                  overflowMenuOnHover={true}
                  headers={[{ key: "Secret", header: "My Secrets" }]} 
                  isSortable>
                  {({ 
                    rows, 
                    headers, 
                    getHeaderProps, 
                    getRowProps, 
                    getTableContainerProps,
                    getTableProps, 
                    onInputChange, 
                    getToolbarProps, 
                    getSelectionProps,
                    getBatchActionProps,
                    selectedRows
                  }) => (
                    <TableContainer
                      title="Secrets Manager"
                      description="View, update, or delete secrets"
                      {...getTableContainerProps()}>
                      <TableToolbar {...getToolbarProps()}>
                        <TableToolbarContent
                          aria-hidden={getBatchActionProps().shouldShowBatchActions}>
                          <TableToolbarSearch 
                            tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                            onChange={onInputChange} />
                        </TableToolbarContent>
                        <TableToolbarMenu>
                          <TableToolbarAction onClick={() => console.log(getLabel(selectedRows))}>
                            Update
                          </TableToolbarAction>
                          <TableToolbarAction onClick={() => console.log(getLabel(selectedRows))}>
                            Delete
                          </TableToolbarAction>
                        </TableToolbarMenu>
                          <Button
                            tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                            onClick={() => console.log(getLabel(selectedRows))}
                            size="small"
                            kind="primary">
                            View Secret
                          </Button>
                      </TableToolbar>
                      <Table {...getTableProps()}>
                        <TableHead>
                          <TableRow>
                            <th scope="col" />
                            {headers.map((header) => (
                                <TableHeader key={header.key} {...getHeaderProps({ header, isSortable: true })}>
                                    {header.header}
                                </TableHeader>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, i) => ( 
                            <TableRow key={i} {...getRowProps({ row })} >
                              <TableSelectRow {...getSelectionProps({ row })} />
                              {row.cells.map((cell) => (
                                <TableCell key={cell.id}>{cell.value}</TableCell>
                              ))}
                            </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    )}
                </DataTable>
              </div>
            )}
          </>
        )
      }
    </>
    

  );
};

export default SecretsList;

