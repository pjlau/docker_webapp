document.addEventListener("DOMContentLoaded", () => {
    const chartDom = document.getElementById("chart");
    const myChart = echarts.init(chartDom);

    // Fetch and render data
    function loadData() {
        fetch("/data")
            .then(response => response.json())
            .then(data => {
                const categories = [...new Set(data.map(item => item.category))];
                const values = data.map(item => ({
                    value: item.value,
                    category: item.category // Store category for tooltip
                }));

                const option = {
                    title: { text: "Data by Category" },
                    tooltip: {
                        trigger: 'item',
                        formatter: function (params) {
                            return `Category: ${params.data.category}<br/>Value: ${params.data.value}`;
                        }
                    },
                    xAxis: { type: "category", data: categories },
                    yAxis: { type: "value" },
                    series: [{
                        data: values,
                        type: "bar",
                        itemStyle: {
                            color: '#5470C6' // Default bar color
                        },
                        emphasis: {
                            itemStyle: {
                                color: '#91CC75' // Highlight color for hovered bar
                            }
                        }
                    }],
                    visualMap: {
                        show: false,
                        pieces: [
                            { gte: 0, color: '#5470C6' } // Default color for non-hovered bars
                        ],
                        outOfRange: {
                            color: '#CCCCCC' // Gray out non-hovered bars
                        }
                    }
                };
                myChart.setOption(option);
            });
    }

    // Form submission
    document.getElementById("data-form").addEventListener("submit", event => {
        event.preventDefault();
        const value = document.getElementById("value").value;
        const category = document.getElementById("category").value;

        fetch("/data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value: parseFloat(value), category })
        }).then(() => {
            loadData();
            document.getElementById("data-form").reset();
        });
    });

    // Initial load
    loadData();
});