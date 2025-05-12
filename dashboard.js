// Static power data - single fixed point
const powerData = [
  { time: "10:00", voltage: 220, current: 0.5, power: 110 }
];

// Fixed energy calculation based on the static data
const totalEnergy = 0.3285;

// Initialize all charts
const charts = {
  powerChart: null,
  consumptionChart: null,
  correlationChart: null,
  distributionChart: null
};

function initCharts() {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#f5f5f5' }
      }
    },
    scales: {
      x: {
        ticks: { color: '#ccc' },
        grid: { color: 'rgba(255,255,255,0.1)' }
      },
      y: {
        ticks: { color: '#ccc' },
        grid: { color: 'rgba(255,255,255,0.1)' }
      }
    }
  };

  // Real-time power chart (static with one point)
  charts.powerChart = new Chart(
    document.getElementById("powerChart").getContext("2d"),
    {
      type: 'line',
      data: {
        labels: powerData.map(d => d.time),
        datasets: [
          {
            label: 'Voltage (V)',
            data: [powerData[0].voltage],
            borderColor: '#f39c12',
            backgroundColor: '#f39c1222',
            fill: true,
            tension: 0.4,
            borderWidth: 2
          },
          {
            label: 'Current (A)',
            data: [powerData[0].current],
            borderColor: '#1abc9c',
            backgroundColor: '#1abc9c22',
            fill: true,
            tension: 0.4,
            borderWidth: 2
          },
          {
            label: 'Power (W)',
            data: [powerData[0].power],
            borderColor: '#e74c3c',
            backgroundColor: '#e74c3c22',
            fill: true,
            tension: 0.4,
            borderWidth: 2
          }
        ]
      },
      options: {
        ...chartOptions,
        animation: {
          duration: 2000 // Smooth initial animation
        }
      }
    }
  );

  // Consumption history chart (static with one point)
  charts.consumptionChart = new Chart(
    document.getElementById("consumptionChart").getContext("2d"),
    {
      type: 'bar',
      data: {
        labels: powerData.map(d => d.time),
        datasets: [{
          label: 'Power Consumption (W)',
          data: [powerData[0].power],
          backgroundColor: '#3498db88',
          borderColor: '#2980b9',
          borderWidth: 1
        }]
      },
      options: {
        ...chartOptions,
        animation: {
          duration: 2000 // Smooth initial animation
        }
      }
    }
  );

  // Correlation chart (static with one point)
  charts.correlationChart = new Chart(
    document.getElementById("correlationChart").getContext("2d"),
    {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Voltage vs Current',
          data: [{
            x: powerData[0].voltage,
            y: powerData[0].current
          }],
          backgroundColor: '#9b59b6',
          borderColor: '#8e44ad',
          pointRadius: 6,
          pointHoverRadius: 8,
          borderWidth: 1
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
            min: 215,
            max: 225
          },
          y: {
            title: {
              display: true,
              text: 'Current (A)',
              color: '#ccc'
            },
            min: 0.45,
            max: 0.6
          }
        },
        animation: {
          duration: 2000 // Smooth initial animation
        }
      }
    }
  );

  // Distribution chart (static with one point)
  createDistributionChart();
}

function createDistributionChart() {
  const ctx = document.getElementById("distributionChart").getContext("2d");

  // Calculate average values
  const avgVoltage = powerData[0].voltage;
  const avgCurrent = powerData[0].current;
  const avgPower = powerData[0].power;

  charts.distributionChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Voltage', 'Current', 'Power'],
      datasets: [{
        data: [avgVoltage, avgCurrent * 100, avgPower],
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
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { 
            color: '#f5f5f5',
            font: {
              size: 12
            }
          }
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
      },
      animation: {
        animateScale: true,
        animateRotate: true
      }
    }
  });
}

function updateCards() {
  const latest = powerData[0];
  document.getElementById("voltage").textContent = latest.voltage.toFixed(1);
  document.getElementById("current").textContent = latest.current.toFixed(2);
  document.getElementById("power").textContent = latest.power.toFixed(1);
  document.getElementById("energy").textContent = totalEnergy.toFixed(4);
}

function displaySystemInfo() {
  document.getElementById("serial-number").textContent = "ESP-ACME01";
  document.getElementById("ip-address").textContent = "192.168.1.100";
  document.getElementById("firmware-version").textContent = "v2.4.1";
  document.getElementById("uptime").textContent = "5 days, 12:34:56";
}

// Initialize everything when the page loads
window.addEventListener('DOMContentLoaded', () => {
  initCharts();
  updateCards();
  displaySystemInfo();
});

function goHome() {
  window.location.href = 'index.html';
}
