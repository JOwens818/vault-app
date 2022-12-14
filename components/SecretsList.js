import React, { useEffect, useState } from 'react';
import { fetcher } from 'lib/utils/apiFetcher';
import { useRouter } from "next/router";
import SessionExpired from './SessionExpired';
import ViewSecretModal from './modals/ViewSecret';
import UpdateSecretModal from './modals/UpdateSecret';
import DeleteSecretModal from './modals/DeleteSecret';
import InlineNoti from './InlineNoti';
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
  SkeletonText
} from '@carbon/react';
import { TrashCan, UpdateNow, View } from '@carbon/react/icons';
	

const SecretsList = (props) => {
	
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [secretListResponse, setSecretListResponse] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [secretLabel, setSecretLabel] = useState("");
  const [noSelection, setNoSelection] = useState(false);


  useEffect(() => {
    const initialize = async () => {
      await getSecretList();
    }
    initialize();
  }, []);


  const getSecretList = async () => {
    setLoading(true);
    setError(false);

    const secretListResp = await fetcher("getSecretList", "/api/secrets/list", "GET");
    if (secretListResp.status === "fail" && secretListResp.message === "Unauthorized") {
      setSessionExpired(true);
    }
    
    if (secretListResp.status === "error") {
      setError(true);
    }
    setSecretListResponse(secretListResp);
    setLoading(false);
  }

  
  const getSecret = async (selectedRow, type) => {
    if (selectedRow.length > 0) {
      setNoSelection(false);
      setSecretLabel(getLabel(selectedRow));
      if (type === "view") {
        setIsViewModalOpen(true);
      } else if (type === "update") {
        setIsUpdateModalOpen(true);
      } else {
        setIsDeleteModalOpen(true);
      } 
    } else {
      setNoSelection(true);
    }
  }


  const getLabel = (selectedRow) => {
    
    if (selectedRow.length === 0) {
      return "Please select a secret";
    }

    let label;
    secretListResponse.data.forEach(s => {
      if (s.id === selectedRow[0].id) {
        label = s.Secret;
      }
    });
    return label;
  }


  const handleModalClose = async (refreshList) => {
    setIsViewModalOpen(false);
    setIsUpdateModalOpen(false);
    setIsDeleteModalOpen(false);
    if (refreshList) {
      await getSecretList();
    }
  }


  return (
    <>

      {
        isViewModalOpen && (
          <ViewSecretModal 
          isViewModalOpen={isViewModalOpen}
          handleModalClose={handleModalClose}
          secretLabel={secretLabel}
          />
        )
      }

      {
        isUpdateModalOpen && (
          <UpdateSecretModal 
            isUpdateModalOpen={isUpdateModalOpen}
            handleModalClose={handleModalClose}
            secretLabel={secretLabel}
          />
        )
      }

      {
        isDeleteModalOpen && (
          <DeleteSecretModal 
            isDeleteModalOpen={isDeleteModalOpen}
            handleModalClose={handleModalClose}
            secretLabel={secretLabel}
          />
        )
      }


      { loading ? (
          <SkeletonText paragraph={true} /> 
        ) : (
          <>
            { sessionExpired && ( <SessionExpired /> ) }

            { noSelection && <InlineNoti data={{ status: "fail", message: "Please select a secret" }}/> }

            { error && ( 
              <Tile>
                <InlineNoti data={secretListResponse}/>
              </Tile> 
            )}
          
            { !error && secretListResponse.data && secretListResponse.data.length === 0 && ( 
              <Tile>
                <InlineNoti data = {{ status: "fail", message: "No secrets found.  Go to the 'Create Secret' tab to start" }}/>
              </Tile> 
            )}

            { !error && secretListResponse.data && secretListResponse.data.length > 0 && (
              <div className='topMargin'>
                <DataTable
                  radio
                  useZebraStyles={true}
                  rows={secretListResponse.data}
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
                          <Button
                            onClick={() => getSecret(selectedRows, "delete")}
                            kind="danger--ghost"
                            hasIconOnly
                            iconDescription="Delete"
                            renderIcon={TrashCan} />
                          <Button
                            onClick={() => getSecret(selectedRows, "update")}
                            kind="ghost"
                            hasIconOnly
                            iconDescription="Update"
                            renderIcon={UpdateNow} />
                          <Button
                            onClick={() => getSecret(selectedRows, "view")}
                            kind="ghost"
                            hasIconOnly
                            iconDescription="View"
                            renderIcon={View} />
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
                            <TableRow key={i} {...getRowProps({ row })}>
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

