import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from "react-table";

function ResultTable({data}) {


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
                            width="36"
                            height="36"
                            alt={row.original.Name}/>
                        {row.original.Name}
                    </span>
                )
            }
        },
        {
            id: "Type",
            Header: 'Type',
            accessor: d => d.type,
        },
        // {
        //     id: "Total",
        //     Header: 'Total',
        //     accessor: d => d.Total,
        // },
        // {
        //     id: "HP",
        //     Header: 'HP',
        //     accessor: d => d.HP
        //
        // },
        // {
        //     id: 'Attack',
        //     Header: 'Attack',
        //     accessor: d => d.Attack
        // },
        // {
        //     id: 'Defense',
        //     Header: 'Defense',
        //     accessor: d => d.Defense,
        // },
        // {
        //     id: "Speed",
        //     Header: 'Speed',
        //     accessor: d => d.Speed,
        // },
        // {
        //     id: 'Sp_Atk',
        //     Header: 'Sp_Atk',
        //     accessor: d => d.Sp_Atk,
        // },
        // {
        //     id: 'Sp_Def',
        //     Header: 'Sp_Def',
        //     accessor: d => d.Sp_Def
        // },
        {
            id: "Prediction",
            Header: "Top 5 Predictions",
            Cell: row => {

                const pokemon = row.original;

                const same = pokemon.pred === pokemon.type;
                const top5 = pokemon.types.includes(pokemon.type);

                const arr = pokemon.types.map((prediction, i) => {

                    if (prediction === pokemon.type) {

                        return <b className={'p-1'} key={prediction + i}>{prediction}</b>
                    }
                    return <span className={'p-1'} key={prediction + i}>{prediction}</span>
                });

                return (
                    <span>
            <span style={{
                color: same ? '#57d500'
                    : top5 ? '#ffbf00'
                        : '#ff2e00',
                transition: 'all .3s ease'
            }}>
              &#x25cf;
            </span> {arr}
          </span>
                );
            }
        }
    ];



    return (



            <ReactTable
                defaultPageSize={10}
                className={'striped'}
                columns={columns}
                data={data}
            />
    );
}

ResultTable.propTypes = {};
ResultTable.defaultProps = {};

export default ResultTable;
