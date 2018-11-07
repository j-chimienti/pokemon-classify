import React from 'react';

import ReactTable from 'react-table'


export function Table({data}) {

    const ex = {
        id: 'friendName', // Required because our accessor is not a string
        // Header: 'Friend Name',
        // Cell: props => <span className='number'>{props.value}</span>, // Custom cell components!
        // accessor: d => d.friend.name // Custom value accessors!
    };

    const columns = [

        {
            id: "Name",
            Header: 'Name',
            accessor: d => d.Name,
            Cell: row => {

                return (
                    <span>
                        <img
                            className={'pr-2'}
                            src={`https://img.pokemondb.net/artwork/${row.original.Name.toLowerCase()}.jpg`}
                             width="36" height="36"
                             alt=""/>
                        {row.original.Name}
                    </span>
                )
            }
        },
        {
            id: "Type",
            Header: 'Type',
            accessor: d => d.Type,
        },
        {
            id: "Total",
            Header: 'Total',
            accessor: d => d.Total,
        },
        {
            id: "HP",
            Header: 'HP',
            accessor: d => d.HP

        },
        {
            id: 'Attack',
            Header: 'Attack',
            accessor: d => d.Attack
        },
        {
            id: 'Defense',
            Header: 'Defense',
            accessor: d => d.Defense,
        },
        {
            id: "Speed",
            Header: 'Speed',
            accessor: d => d.Speed,
        },
        {
            id: 'Sp_Atk',
            Header: 'Sp Atk',
            accessor: d => d.Sp_Atk,
        },
        {
            id: 'Sp_Def',
            Header: 'Sp Def',
            accessor: d => d.Sp_Def
        }


    ];

    return <ReactTable
        data={data}
        defaultPageSize={10}
        columns={columns}
        className="-striped -highlight"
    />;
}
