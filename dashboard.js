// Simulated power data
let powerData = [
  { time: "10:00", voltage: 220, current: 0.5, power: 110 },
  { time: "10:01", voltage: 222, current: 0.52, power: 115 },
  { time: "10:02", voltage: 221, current: 0.55, power: 121 },
];
let totalEnergy = 0;

// Initialize all charts
let charts = {
  powerChart: null,
  consumptionChart: null,
  correlationChart: null,
  distributionChart: null
};

function initCharts() {
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: '#f5f5f5' }
      }
    },
    scales: {
      x: {
        ticks: { color: '#ccc' }
      },
      y: {
        ticks: { color: '#ccc' }
      }
    }
  };

  // Real-time power chart
  charts.powerChart = new Chart(
    document.getElementById("powerChart").getContext("2d"),
    {
      type: 'line',
      data: {
        labels: powerData.map(d => d.time),
        datasets: [
          {
            label: 'Voltage (V)',
            data: powerData.map(d => d.voltage),
            borderColor: '#f39c12',
            backgroundColor: '#f39c1222',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Current (A)',
            data: powerData.map(d => d.current),
            borderColor: '#1abc9c',
            backgroundColor: '#1abc9c22',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Power (W)',
            data: powerData.map(d => d.power),
            borderColor: '#e74c3c',
            backgroundColor: '#e74c3c22',
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: chartOptions
    }
  );

  // Consumption history chart
  charts.consumptionChart = new Chart(
    document.getElementById("consumptionChart").getContext("2d"),
    {
      type: 'bar',
      data: {
        labels: powerData.map(d => d.time),
        datasets: [{
          label: 'Power (W)',
          data: powerData.map(d => d.power),
          backgroundColor: '#3498db',
          borderColor: '#2980b9',
          borderWidth: 1
        }]
      },
      options: chartOptions
    }
  );

  // Correlation chart
  charts.correlationChart = new Chart(
    document.getElementById("correlationChart").getContext("2d"),
    {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Voltage vs Current',
          data: powerData.map(d => ({
            x: d.voltage,
            y: d.current
          })),
          backgroundColor: '#9b59b6',
          borderColor: '#8e44ad',
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        ...chartOptions,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Voltage (V)',
              color: '#ccc'
            },
            ticks: { color: '#ccc' }
          },
          y: {
            title: {
              display: true,
              text: 'Current (A)',
              color: '#ccc'
            },
            ticks: { color: '#ccc' }
          }
        }
      }
    }
  );

  // Distribution chart
  updateDistributionChart();
}

function updateDistributionChart() {
  const ctx = document.getElementById("distributionChart").getContext("2d");
  
  if (charts.distributionChart) {
    charts.distributionChart.destroy();
  }

  // Calculate average values
  const avgVoltage = powerData.reduce((sum, d) => sum + d.voltage, 0) / powerData.length;
  const avgCurrent = powerData.reduce((sum, d) => sum + d.current, 0) / powerData.length;
  const avgPower = powerData.reduce((sum, d) => sum + d.power, 0) / powerData.length;

  charts.distributionChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Voltage', 'Current', 'Power'],
      datasets: [{
        data: [avgVoltage, avgCurrent * 100, avgPower], // Scale current for better visualization
        backgroundColor: [
          '#f39c12',
          '#1abc9c',
          '#e74c3c'
        ],
        borderColor: [
          '#e67e22',
          '#16a085',
          '#c0392b'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: '#f5f5f5' }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.label || '';
              if (label) {
                label += ': ';
              }
              if (context.label === 'Current') {
                label += (context.raw / 100).toFixed(2) + ' A';
              } else {
                label += context.raw.toFixed(1) + (context.label === 'Power' ? ' W' : ' V');
              }
              return label;
            }
          }
        }
      }
    }
  });
}

function updateCards() {
  const latest = powerData[powerData.length - 1];
  document.getElementById("voltage").textContent = latest.voltage.toFixed(1);
  document.getElementById("current").textContent = latest.current.toFixed(2);
  document.getElementById("power").textContent = latest.power.toFixed(1);
  
  // Calculate energy (kWh) - assuming 2 second intervals
  totalEnergy += latest.power * (2 / 3600);
  document.getElementById("energy").textContent = totalEnergy.toFixed(4);
}

function addDataPoint(time, voltage, current) {
  const power = voltage * current;
  const newPoint = { time, voltage, current, power };

  // Update the powerData array
  powerData.push(newPoint);
  if (powerData.length > 20) powerData.shift(); // Keep last 20 points

  // Update all charts
  charts.powerChart.data.labels = powerData.map(d => d.time);
  charts.powerChart.data.datasets[0].data = powerData.map(d => d.voltage);
  charts.powerChart.data.datasets[1].data = powerData.map(d => d.current);
  charts.powerChart.data.datasets[2].data = powerData.map(d => d.power);
  charts.powerChart.update();

  charts.consumptionChart.data.labels = powerData.map(d => d.time);
  charts.consumptionChart.data.datasets[0].data = powerData.map(d => d.power);
  charts.consumptionChart.update();

  charts.correlationChart.data.datasets[0].data = powerData.map(d => ({
    x: d.voltage,
    y: d.current
  }));
  charts.correlationChart.update();

  updateDistributionChart();
  updateCards();
}

// Initialize everything
initCharts();
updateCards();

// 🔧 Generate random serial number
function generateRandomSerial() {
  const hex = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase();
  return "ESP-" + hex.padStart(6, "0");
}

// 🌐 Get public IP address
function displaySystemInfo() {
  const serial = generateRandomSerial();
  document.getElementById("serial-number").textContent = serial;

  fetch("https://api.ipify.org?format=json")
    .then(response => response.json())
    .then(data => {
      document.getElementById("ip-address").textContent = data.ip;
    })
    .catch(() => {
      document.getElementById("ip-address").textContent = "Unavailable";
    });
}

displaySystemInfo();

// Simulate data updates
setInterval(() => {
  const now = new Date();
  const time = now.getHours().toString().padStart(2, '0') + ":" +
               now.getMinutes().toString().padStart(2, '0') + ":" +
               now.getSeconds().toString().padStart(2, '0');

  const voltage = 215 + Math.random() * 10; // e.g., 215V–225V
  const current = 0.4 + Math.random() * 0.3; // e.g., 0.4A–0.7A

  addDataPoint(time, voltage, current);
}, 1000);






  function goHome() {
    // Redirect to the home page
    window.location.href = 'index.html';
  }