import { registerOTel } from "@vercel/otel";
import {
  MeterProvider,
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} from "@opentelemetry/sdk-metrics";
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";

export function register() {
  // Set OpenTelemetry diagnostic logger
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

  // Auto instrumentation for Next.js (server components, fetch, etc.)
  registerOTel({
    serviceName: "next-app",
  });

  // Create a MeterProvider to define and export custom metrics
  const meterProvider = new MeterProvider();

  // Export metrics to console every 5 seconds
  const metricReader = new PeriodicExportingMetricReader({
    exporter: new ConsoleMetricExporter(),
    exportIntervalMillis: 5000,
  });

  meterProvider.addMetricReader(metricReader);

  const meter = meterProvider.getMeter("custom-metrics");

  // Memory usage gauge (RSS, heapUsed, heapTotal)
  const memGauge = meter.createObservableGauge("memory_usage", {
    description: "Memory usage in bytes",
  });

  memGauge.addCallback((obs) => {
    if (
      typeof process !== "undefined" &&
      typeof process.memoryUsage === "function"
    ) {
      const mem = process.memoryUsage();
      obs.observe(mem.rss, { type: "rss" });
      obs.observe(mem.heapUsed, { type: "heap_used" });
      obs.observe(mem.heapTotal, { type: "heap_total" });
    } else {
      console.warn("[OTEL] process.memoryUsage is not available.");
    }
  });

  // CPU usage gauge (user/system time)
  const cpuGauge = meter.createObservableGauge("cpu_usage", {
    description: "CPU usage in microseconds",
  });

  cpuGauge.addCallback((obs) => {
    if (
      typeof process !== "undefined" &&
      typeof process.cpuUsage === "function"
    ) {
      try {
        const usage = process.cpuUsage();
        obs.observe(usage.user, { type: "user" });
        obs.observe(usage.system, { type: "system" });
      } catch (err) {
        console.warn("[OTEL] Failed to record CPU usage:", err);
      }
    } else {
      console.warn(
        "[OTEL] process.cpuUsage is not available in this environment."
      );
    }
  });

  console.log("[OTEL] OpenTelemetry setup complete.");
}
