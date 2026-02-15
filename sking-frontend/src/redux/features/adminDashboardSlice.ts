import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { adminDashboardApiService, DashboardPeriod, DashboardStats } from '@/services/admin/adminDashboardApiService';

interface MetricsState {
    data: DashboardStats | null;
    loading: boolean;
    error: string | null;
    customerPeriod: DashboardPeriod;
    orderPeriod: DashboardPeriod;
}

interface SalesChartState {
    data: DashboardStats | null;
    loading: boolean;
    error: string | null;
    year: number;
}

interface PerformanceChartState {
    data: DashboardStats | null;
    loading: boolean;
    error: string | null;
    startDate: string | null;
    endDate: string | null;
    period: "Monthly" | "Quarterly" | "Annually";
}

interface ReportState {
    data: DashboardStats | null; // This will hold the report data
    loading: boolean;
    error: string | null;
    startDate: string | null;
    endDate: string | null;
}

interface AdminDashboardState {
    metrics: MetricsState;
    salesChart: SalesChartState;
    performanceChart: PerformanceChartState;
    report: ReportState;
}

const initialState: AdminDashboardState = {
    metrics: {
        data: null,
        loading: false,
        error: null,
        customerPeriod: 'weekly',
        orderPeriod: 'weekly',
    },
    salesChart: {
        data: null,
        loading: false,
        error: null,
        year: new Date().getFullYear(),
    },
    performanceChart: {
        data: null,
        loading: false,
        error: null,
        startDate: null,
        endDate: null,
        period: "Monthly",
    },
    report: {
        data: null,
        loading: false,
        error: null,
        startDate: null,
        endDate: null,
    }
};

// Async Thunks

export const fetchMetrics = createAsyncThunk(
    'adminDashboard/fetchMetrics',
    async ({ customerPeriod, orderPeriod }: { customerPeriod: DashboardPeriod; orderPeriod: DashboardPeriod }, { rejectWithValue }) => {
        try {
            const response = await adminDashboardApiService.getDashboardStats(customerPeriod, orderPeriod);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch metrics');
        }
    }
);

export const fetchSalesChart = createAsyncThunk(
    'adminDashboard/fetchSalesChart',
    async (year: number, { rejectWithValue }) => {
        try {
            const startDate = new Date(year, 0, 1).toISOString();
            const endDate = new Date(year, 11, 31, 23, 59, 59, 999).toISOString();
            // We pass 'weekly' as dummy periods, but provide the range to filter sales
            const response = await adminDashboardApiService.getDashboardStats('weekly', 'weekly', { startDate, endDate });
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch sales chart');
        }
    }
);

export const fetchPerformanceChart = createAsyncThunk(
    'adminDashboard/fetchPerformanceChart',
    async (range: { startDate: string; endDate: string } | undefined, { rejectWithValue }) => {
        try {
            const response = await adminDashboardApiService.getDashboardStats('weekly', 'weekly', range);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch performance chart');
        }
    }
);

export const fetchReport = createAsyncThunk(
    'adminDashboard/fetchReport',
    async (range: { startDate: string; endDate: string }, { rejectWithValue }) => {
        try {
            const response = await adminDashboardApiService.getDashboardStats('weekly', 'weekly', range);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch report data');
        }
    }
);


const adminDashboardSlice = createSlice({
    name: 'adminDashboard',
    initialState,
    reducers: {
        setMetricsStart: (state) => {
            state.metrics.loading = true;
        },
        setSalesChartYear: (state, action: PayloadAction<number>) => {
            state.salesChart.year = action.payload;
        },
        setPerformanceRange: (state, action: PayloadAction<{ startDate: string | null; endDate: string | null, period: "Monthly" | "Quarterly" | "Annually" }>) => {
            state.performanceChart.startDate = action.payload.startDate;
            state.performanceChart.endDate = action.payload.endDate;
            state.performanceChart.period = action.payload.period;
        },
        setMetricsPeriods: (state, action: PayloadAction<{ customerPeriod: DashboardPeriod; orderPeriod: DashboardPeriod }>) => {
            state.metrics.customerPeriod = action.payload.customerPeriod;
            state.metrics.orderPeriod = action.payload.orderPeriod;
        },
        clearReport(state) {
            state.report.data = null;
            state.report.startDate = null;
            state.report.endDate = null;
        }
    },
    extraReducers: (builder) => {
        // Metrics
        builder.addCase(fetchMetrics.pending, (state) => {
            state.metrics.loading = true;
            state.metrics.error = null;
        });
        builder.addCase(fetchMetrics.fulfilled, (state, action) => {
            state.metrics.loading = false;
            state.metrics.data = action.payload;
        });
        builder.addCase(fetchMetrics.rejected, (state, action) => {
            state.metrics.loading = false;
            state.metrics.error = action.payload as string;
        });

        // Sales Chart
        builder.addCase(fetchSalesChart.pending, (state) => {
            state.salesChart.loading = true;
            state.salesChart.error = null;
        });
        builder.addCase(fetchSalesChart.fulfilled, (state, action) => {
            state.salesChart.loading = false;
            state.salesChart.data = action.payload;
        });
        builder.addCase(fetchSalesChart.rejected, (state, action) => {
            state.salesChart.loading = false;
            state.salesChart.error = action.payload as string;
        });

        // Performance Chart
        builder.addCase(fetchPerformanceChart.pending, (state) => {
            state.performanceChart.loading = true;
            state.performanceChart.error = null;
        });
        builder.addCase(fetchPerformanceChart.fulfilled, (state, action) => {
            state.performanceChart.loading = false;
            state.performanceChart.data = action.payload;
        });
        builder.addCase(fetchPerformanceChart.rejected, (state, action) => {
            state.performanceChart.loading = false;
            state.performanceChart.error = action.payload as string;
        });

        // Report
        builder.addCase(fetchReport.pending, (state, action) => {
            state.report.loading = true;
            state.report.error = null;
            state.report.startDate = action.meta.arg.startDate;
            state.report.endDate = action.meta.arg.endDate;
        });
        builder.addCase(fetchReport.fulfilled, (state, action) => {
            state.report.loading = false;
            state.report.data = action.payload;
        });
        builder.addCase(fetchReport.rejected, (state, action) => {
            state.report.loading = false;
            state.report.error = action.payload as string;
        });
    },
});

export const { setSalesChartYear, setPerformanceRange, setMetricsPeriods, clearReport } = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;
