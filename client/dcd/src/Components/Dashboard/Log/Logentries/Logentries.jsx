import React, { useState, useEffect } from 'react';
import { Table, Form, CloseButton, InputGroup } from 'react-bootstrap';
import InputGroupText from 'react-bootstrap/esm/InputGroupText';
import Tablepagination from '../../Tablepagination/Tablepagination';
import Viewlog from '../Viewlog/Viewlog';
import Editlog from '../Editlog/Editlog';
import Deletelog from '../Deletelog/Deletelog';

export default function Logentries( {
  logEntries,
  loadLogEntries,
  handleSort,
  sortDirection,
  sortedColumn,
  setSortedColumn,
  setSortDirection,
  } ) {
  const [usernameSearch, setUsernameSearch] = useState('');
  const [clientnameSearch, setClientnameSearch] = useState('');
  const [dateTimeSearch, setDateTimeSearch] = useState('');
  const [durationSearch, setDurationSearch] = useState('');
  const [descriptionSearch, setDescriptionSearch] = useState('');

  const chooseOrderSign = (data) => sortedColumn === data ? sortDirection === 'asc' ? <>⇓</> : <>⇑</> : <>⇅</>
  
  const filteredList = logEntries
                        .filter((listItem) => usernameSearch.toLowerCase() === '' ? listItem 
                          : listItem.user_name.toLowerCase().includes(usernameSearch.toLowerCase()))
                        .filter((listItem) => clientnameSearch.toLowerCase() === '' 
                          ? listItem 
                          : listItem.client_name.toLowerCase().includes(clientnameSearch.toLowerCase()))
                          .filter((listItem) => dateTimeSearch === '' 
                          ? listItem 
                          : listItem.date_time.includes(dateTimeSearch))
                        .filter((listItem) => durationSearch === '' 
                          ? listItem 
                          : listItem.duration === durationSearch)
                        .filter((listItem) => descriptionSearch.toLowerCase() === '' 
                        ? listItem 
                        : listItem.description.toLowerCase().includes(descriptionSearch.toLowerCase()))
  
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowPerPage] = useState(10);
  
  useEffect ( () => {
    if (logEntries.length > filteredList.length) {
      setCurrentPage(1);
    if (rowsPerPage > filteredList.length && filteredList.length >=10) {
        setRowPerPage(filteredList.length);
      }
      
    }}, [logEntries.length, filteredList.length, rowsPerPage]);

  const paginatedList = filteredList.slice(currentPage * rowsPerPage - rowsPerPage, currentPage * rowsPerPage);

  function dateTimeSearchValue(e) {
    if (!isNaN(Number(e.key)) && dateTimeSearch.length < 16) {
      setDateTimeSearch(dateTimeSearch + e.key);
      if (dateTimeSearch.length ===  3) setDateTimeSearch(dateTimeSearch + e.key + '-');
      if (dateTimeSearch.length ===  6) setDateTimeSearch(dateTimeSearch + e.key + '-');
      if (dateTimeSearch.length ===  9) setDateTimeSearch(dateTimeSearch + e.key + ' ');
      if (dateTimeSearch.length === 12) setDateTimeSearch(dateTimeSearch + e.key + ':');
    } else if (e.key === 'Backspace') setDateTimeSearch(
      dateTimeSearch.slice(-1) === '-' ||
      dateTimeSearch.slice(-1) === ' ' ||
      dateTimeSearch.slice(-1) === ':' ?
      dateTimeSearch.slice(0,-2) :
      dateTimeSearch.slice(0,-1));
  }
  
  return (
    <div className='m-3'>
      <Table striped bordered hover size="sm">
        <thead>
          <tr><th colSpan={12}>Naplóbejegyzések listája</th></tr>
          <tr>
            <th>#
            <span 
                className="cursor-pointer mx-2"
                onClick={() => {
                  handleSort(logEntries, sortDirection, 'id', 'log');
                  setSortedColumn('id');
                  setSortDirection(sortDirection ==='des' ? 'asc' : 'des');
                }}>
                {chooseOrderSign('id')}
              </span>
            </th>
            <th>Felhasználónév
              <span 
                className="cursor-pointer mx-2"
                onClick={() => {
                  handleSort(logEntries, sortDirection, 'user_name', 'log')
                  setSortedColumn('user_name');
                  setSortDirection(sortDirection ==='des' ? 'asc' : 'des');
                }}>
                {chooseOrderSign('user_name')}
              </span>
            </th>
            <th className='max-width-115'>Ügyfélnév
              <span 
                className="cursor-pointer mx-2"
                onClick={() => {
                  handleSort(logEntries, sortDirection, 'client_name', 'log')
                  setSortedColumn('client_name');
                  setSortDirection(sortDirection ==='des' ? 'asc' : 'des');
                }}>
                  {chooseOrderSign('client_name')}
              </span>
            </th>
            <th className='d-none d-sm-table-cell'>Időpont
                <span 
                    className="cursor-pointer mx-2"
                    onClick={() => {
                    handleSort(logEntries, sortDirection, 'date_time', 'log')
                    setSortedColumn('date_time');
                    setSortDirection(sortDirection ==='des' ? 'asc' : 'des');
                    }}>
                    {chooseOrderSign('date_time')}
                </span>
            </th>
            <th className='max-width-65 d-none d-md-table-cell'>Perc
              <span 
                className="cursor-pointer mx-2"
                onClick={() => {
                  handleSort(logEntries, sortDirection, 'duration', 'log')
                  setSortedColumn('duration');
                  setSortDirection(sortDirection ==='des' ? 'asc' : 'des');
                }}>
                {chooseOrderSign('duration')}
              </span>
            </th>               
            <th className='d-none d-lg-table-cell'>Leírás</th>
            <th></th>
          </tr>
          <tr>
            <th>{filteredList.length}</th>
            <th>
              <InputGroup>
                <Form.Control
                  id="userNameSearch" 
                  onChange={(e) => setUsernameSearch(e.target.value)}
                  placeholder = "Felhasználónév..."
                  value={usernameSearch}/>
                {usernameSearch !== '' ? <InputGroupText><CloseButton onClick={()=> setUsernameSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
            <th className='max-width-115'>
              <InputGroup>
                <Form.Control
                  id="usernameSearch"
                  onChange={(e) => setClientnameSearch(e.target.value)}
                  placeholder = "Ügyfélnév..."
                  value={clientnameSearch}/>
                {clientnameSearch !== '' ? <InputGroupText><CloseButton onClick={()=> setClientnameSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
            <th className='d-none d-sm-table-cell'>
              <InputGroup>
                <Form.Control
                  id="datetimeSearch"
                  onKeyDown={(e) => dateTimeSearchValue(e)}
                  onChange={() => setDateTimeSearch(dateTimeSearch)}
                  maxLength={16}
                  placeholder = "Időpont..."
                  value={dateTimeSearch} />
                  {dateTimeSearch !== '' ? <InputGroupText><CloseButton onClick={()=> setDateTimeSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
            <th className='max-width-65 d-none d-md-table-cell'>
              <InputGroup>
                <Form.Control
                  id="durationSearch"
                  onChange={(e) => setDurationSearch(e.target.value)}
                  maxLength={2}
                  placeholder = "Perc..."
                  value={durationSearch}/>
                  {durationSearch !== '' ? <InputGroupText><CloseButton onClick={()=> setDurationSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
            <th className='d-none d-lg-table-cell'>
              <InputGroup>
                <Form.Control
                  id="descriptionSearch"
                  onChange={(e) => setDescriptionSearch(e.target.value)}
                  placeholder = "Leírás..."
                  value={descriptionSearch}/>
                  {descriptionSearch !== '' ? <InputGroupText><CloseButton onClick={()=> setDescriptionSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
              <th></th>
            </tr>
        </thead>
        <tbody>
          {paginatedList
            .map((listItem) => {
              return (
              <tr className={listItem.inactive === 1 ? "text-decoration-line-through" : ""} key={listItem.id}>
                  <td>{listItem.id}</td>
                  <td>{listItem.user_name}</td>
                  <td>{listItem.client_name}</td>
                  <td className='max-width-115 d-none d-sm-table-cell'>{listItem.date_time}</td>
                  <td className='max-width-65 d-none d-md-table-cell'>{listItem.duration}</td>                    
                  <td className='d-none d-lg-table-cell'>{listItem.description.length > 100 ? 
                                                            listItem.description.slice(0, 100)+ '...' : 
                                                            listItem.description}</td>
                  <td className='width-150'>
                  <>
                    <Viewlog
                      logEntry = {listItem}/>
                    <Editlog
                      logEntry = {listItem}
                      loadLogEntries = {loadLogEntries}/>
                    <Deletelog
                      listItem = {listItem}
                      loadLogEntries = {loadLogEntries}/>
                  </>    
                </td>
              </tr>
)})}
        </tbody>
        <tfoot>
        <tr>
            <th>#</th>
            <th>Felhasználónév</th>
            <th className='max-width-115'>Ügyfélnév</th>
            <th className='max-width-115 d-none d-sm-table-cell'>Időpont</th>
            <th className='max-width-65 d-none d-md-table-cell'>Perc</th>
            <th className='d-none d-lg-table-cell'>Leírás</th>
            <th></th>
          </tr>
        </tfoot>
      </Table>
      <Tablepagination 
        tableRows={filteredList}
        rowsPerPage={rowsPerPage}
        setRowPerPage={setRowPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  )
}        
