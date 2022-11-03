import React, { useEffect, useState } from 'react';
import { fetcher } from 'lib/apiFetcher';
import { useRouter } from "next/router";
import { 
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
  Tile,
  DataTableSkeleton
} from '@carbon/react';
	
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

  

  
  return (
    <>
      { loading ? (
          <DataTableSkeleton />
        ) : (
          <>
            { sessionExpired && (
              <Tile>
                <h5>Session Expired... <a href="/login">Click here to login!</a></h5>
              </Tile>
            )}

            { error && ( <Tile><h4>Error Retrieving Secrets...</h4></Tile> ) }
          
            { !error && secretList && secretList.length === 0 && ( <Tile><h4>No secrets found</h4></Tile> ) }

            { !error && secretList && secretList.length > 0 && (
              <div className='topMargin'>
                <DataTable
                  useZebraStyles={true}
                  rows={secretList}
                  overflowMenuOnHover={true}
                  headers={[{ key: "Secret", header: "Secret" }]} isSortable>
          
                    {({ rows, headers, getHeaderProps, getRowProps,
                      getTableProps, onInputChange, getToolbarProps }) => (
                    <TableContainer >
                      <h4 class="cds--data-table-header__title">Click secret to retrieve value</h4>
                      <TableToolbar {...getToolbarProps()}>
                        <TableToolbarContent>
                          <TableToolbarSearch
                            onChange={onInputChange}
                          />
                        </TableToolbarContent>
                      </TableToolbar>
                      <Table {...getTableProps()}>
                        <TableHead>
                          <TableRow>
                            {headers.map((header) => (
                                <TableHeader key={header.key} {...getHeaderProps({ header, isSortable: true })}>
                                    {header.header}
                                </TableHeader>
                            ))}
                            <TableHeader>
                            </TableHeader>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => ( 
                            <TableRow key={row.id} {...getRowProps({ row })}
                              onClick={(e) => {
                                alert(row.Secret);
                              }}
                            >
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

