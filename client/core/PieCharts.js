import React, { useState, useEffect } from 'react';
import PieChart, {
    Series,
    Label,
    Connector,
    Size,
    Export
} from 'devextreme-react/pie-chart';

export default function PieCharts(props) {
    const [ChartData, setChartData] = React.useState([]);

    useEffect(() => {
        
            var data = props.cars
            var pieData = []
            let counts = data.reduce(function (result, item) {
                var currentCount = result[item.manufacturer] || 0;
                result[item.manufacturer] = currentCount + 1;
                return result;
            }, {});
            //setoptions.label = counts
            for (var key in counts) {
                let obj = {}
                obj["manufacturer"] = key
                obj["totalCarsBymanufacturer"] = counts[key]
                pieData.push(obj)
            }
            setChartData(pieData)
        
        return () => {

        }
    }, [props.cars])
    const pointClickHandler = e => {
        toggleVisibility(e.target);
    }

    const legendClickHandler = e => {
        let arg = e.target;
        let item = e.component.getAllSeries()[0].getPointsByArg(arg)[0];

        this.toggleVisibility(item);
    }

    const toggleVisibility = e => {
        item.isVisible() ? item.hide() : item.show();
    }

    return (
        <PieChart
            id="pie"
            dataSource={ChartData}
            palette="Bright"
            title="Pie chart"
            onPointClick={pointClickHandler}
            onLegendClick={legendClickHandler}
        >
            <Series
                argumentField="manufacturer"
                valueField="totalCarsBymanufacturer"
            >
                <Label visible={true}>
                    <Connector visible={true} width={1} />
                </Label>
            </Series>

            <Size width={500} />
            <Export enabled={true} />
        </PieChart>
    );
}
