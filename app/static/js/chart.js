document.addEventListener("DOMContentLoaded", () => {
    const chartDom = document.getElementById("chart");
    const myChart = echarts.init(chartDom);
    const deleteSelect = document.getElementById("delete-select");
    const deleteButton = document.getElementById("delete-button");

    // Fetch and render data
    function loadData() {
        fetch("/data")
            .then(response => response.json())
            .then(data => {
                // Update chart
                const categories = [...new Set(data.map(item => item.category))];
                const values = data.map(item => ({
                    value: item.value,
                    category: item.category
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
                            color: '#5470C6'
                        },
                        emphasis: {
                            itemStyle: {
                                color: '#91CC75'
                            }
                        }
                    }],
                    visualMap: {
                        show: false,
                        pieces: [{ gte: 0, color: '#5470C6' }],
                        outOfRange: { color: '#CCCCCC' }
                    }
                };
                myChart.setOption(option);

                // Update dropdown
                deleteSelect.innerHTML = '<option value="">Select an item</option>';
                data.forEach(item => {
                    const option = document.createElement("option");
                    option.value = item._id;
                    option.text = `Category: ${item.category}, Value: ${item.value}`;
                    deleteSelect.appendChild(option);
                });
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

    // Delete button click
    deleteButton.addEventListener("click", () => {
        const selectedId = deleteSelect.value;
        if (selectedId) {
            fetch(`/data/${selectedId}`, {
                method: "DELETE"
            }).then(response => {
                if (response.ok) {
                    loadData(); // Refresh chart and dropdown
                } else {
                    alert("Failed to delete item");
                }
            }).catch(() => alert("Error deleting item"));
        } else {
            alert("Please select an item to delete");
        }
    });

    // Initial load
    loadData();
});