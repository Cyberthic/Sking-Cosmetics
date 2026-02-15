import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { adminDashboardApiService, DashboardPeriod, DashboardStats, RecentOrder, DemographicData, StateDemographic, SalesDataPoint, PerformanceDataPoint, MonthlyTarget } from '@/services/admin/adminDashboardApiService';

interface SummaryState {
    customerStats: DashboardStats['customerStats'] | null;
    orderStats: DashboardStats['orderStats'] | null;
    loading: boolean;
    error: string | null;
    customerPeriod: DashboardPeriod;
    orderPeriod: DashboardPeriod;
}

interface SalesChartState {
    data: SalesDataPoint[];
    loading: boolean;
    error: string | null;
    year: number;
}

interface PerformanceChartState {
    data: PerformanceDataPoint[];
    loading: boolean;
    error: string | null;
    startDate: string | null;
    endDate: string | null;
    period: "Monthly" | "Quarterly" | "Annually";
}

interface RecentOrdersState {
    data: RecentOrder[];
    loading: boolean;
    error: string | null;
}

interface DemographicsState {
    data: DemographicData[];
    stateData: StateDemographic[];
    loading: boolean;
    error: string | null;
}

interface MonthlyTargetState {
    data: MonthlyTarget | null;
    loading: boolean;
    error: string | null;
}

interface ReportState {
    data: DashboardStats | null;
    loading: boolean;
    error: string | null;
    startDate: string | null;
    endDate: string | null;
}

interface AdminDashboardState {
    summary: SummaryState;
    salesChart: SalesChartState;
    performanceChart: PerformanceChartState;
    recentOrders: RecentOrdersState;
    demographics: DemographicsState;
    monthlyTarget: MonthlyTargetState;
    report: ReportState;
    // Master loading state for the whole dashboard initial load if needed
    isDashboardLoading: boolean;
}

const initialState: AdminDashboardState = {
    summary: {
        customerStats: null,
        orderStats: null,
        loading: false,
        error: null,
        customerPeriod: 'weekly',
        orderPeriod: 'weekly',
    },
    salesChart: {
        data: [],
        loading: false,
        error: null,
        year: new Date().getFullYear(),
    },
    performanceChart: {
        data: [],
        loading: false,
        error: null,
        startDate: null,
        endDate: null,
        period: "Monthly",
    },
    recentOrders: {
        data: [],
        loading: false,
        error: null,
    },
    demographics: {
        data: [],
        stateData: [],
        loading: false,
        error: null,
    },
    monthlyTarget: {
        data: null,
        loading: false,
        error: null,
    },
    report: {
        data: null,
        loading: false,
        error: null,
        startDate: null,
        endDate: null,
    },
    isDashboardLoading: false,
};

// --- Async Thunks ---

export const fetchSummary = createAsyncThunk(
    'adminDashboard/fetchSummary',
    async ({ customerPeriod, orderPeriod }: { customerPeriod: DashboardPeriod; orderPeriod: DashboardPeriod }, { rejectWithValue }) => {
        try {
            return await adminDashboardApiService.getSummaryStats(customerPeriod, orderPeriod);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch summary stats');
        }
    }
);

export const fetchSalesChart = createAsyncThunk(
    'adminDashboard/fetchSalesChart',
    async (year: number, { rejectWithValue }) => {
        try {
            const startDate = new Date(year, 0, 1).toISOString();
            const endDate = new Date(year, 11, 31, 23, 59, 59, 999).toISOString();
            return await adminDashboardApiService.getSalesChart(startDate, endDate);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch sales chart');
        }
    }
);

export const fetchPerformanceChart = createAsyncThunk(
    'adminDashboard/fetchPerformanceChart',
    async (range: { startDate: string; endDate: string } | undefined, { rejectWithValue }) => {
        try {
            return await adminDashboardApiService.getCustomerPerformance(range?.startDate, range?.endDate);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch performance chart');
        }
    }
);

export const fetchRecentOrders = createAsyncThunk(
    'adminDashboard/fetchRecentOrders',
    async (_, { rejectWithValue }) => {
        try {
            return await adminDashboardApiService.getRecentOrders();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch recent orders');
        }
    }
);

export const fetchDemographics = createAsyncThunk(
    'adminDashboard/fetchDemographics',
    async (_, { rejectWithValue }) => {
        try {
            return await adminDashboardApiService.getDemographics();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch demographics');
        }
    }
);

export const fetchMonthlyTarget = createAsyncThunk(
    'adminDashboard/fetchMonthlyTarget',
    async (_, { rejectWithValue }) => {
        try {
            return await adminDashboardApiService.getMonthlyTarget();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch monthly target');
        }
    }
);

export const fetchReport = createAsyncThunk(
    'adminDashboard/fetchReport',
    async (range: { startDate: string; endDate: string }, { rejectWithValue }) => {
        try {
            // Re-using the main stats endpoint which aggregates everything, suitable for a report
            return await adminDashboardApiService.getDashboardStats('weekly', 'weekly', range);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch report data');
        }
    }
);

// --- Master Orchestrator Thunk ---
export const loadDashboardSequentially = createAsyncThunk(
    'adminDashboard/loadSequentially',
    async (_, { dispatch, getState }) => {
        console.log("🚀 Starting Sequential Dashboard Load");
        const state = getState() as any;
        const { year } = state.adminDashboard.salesChart;
        const { customerPeriod, orderPeriod } = state.adminDashboard.summary;
        const { startDate, endDate } = state.adminDashboard.performanceChart;

        // Sequence:
        // 1. Summary Metrics & Monthly Target (Critical Top Information)
        // 2. Sales Chart (Main Visual)
        // 3. Performance Chart
        // 4. Recent Orders
        // 5. Demographics (Heavy data)

        await dispatch(fetchSummary({ customerPeriod, orderPeriod }));
        await dispatch(fetchMonthlyTarget());
        await dispatch(fetchSalesChart(year));

        // Performance chart might need range, handle optionality or default logic in thunk
        // If range is null, the thunk handles undefined appropriately
        await dispatch(fetchPerformanceChart(startDate && endDate ? { startDate, endDate } : undefined));

        await dispatch(fetchRecentOrders());
        await dispatch(fetchDemographics());

        console.log("✅ Sequential Dashboard Load Complete");
    }
);


const adminDashboardSlice = createSlice({
    name: 'adminDashboard',
    initialState,
    reducers: {
        setMetricsPeriods: (state, action: PayloadAction<{ customerPeriod: DashboardPeriod; orderPeriod: DashboardPeriod }>) => {
            state.summary.customerPeriod = action.payload.customerPeriod;
            state.summary.orderPeriod = action.payload.orderPeriod;
        },
        setSalesChartYear: (state, action: PayloadAction<number>) => {
            state.salesChart.year = action.payload;
        },
        setPerformanceRange: (state, action: PayloadAction<{ startDate: string | null; endDate: string | null, period: "Monthly" | "Quarterly" | "Annually" }>) => {
            state.performanceChart.startDate = action.payload.startDate;
            state.performanceChart.endDate = action.payload.endDate;
            state.performanceChart.period = action.payload.period;
        },
        clearDashboardState: (state) => {
            // Reset to initial state logic if needed
        },
        clearReport: (state) => {
            state.report.data = null;
            state.report.startDate = null;
            state.report.endDate = null;
            state.report.error = null;
            state.report.loading = false;
        }
    },
    extraReducers: (builder) => {
        // Summary
        builder.addCase(fetchSummary.pending, (state) => { state.summary.loading = true; state.summary.error = null; });
        builder.addCase(fetchSummary.fulfilled, (state, action) => {
            state.summary.loading = false;
            state.summary.customerStats = action.payload.customerStats;
            state.summary.orderStats = action.payload.orderStats;
        });
        builder.addCase(fetchSummary.rejected, (state, action) => { state.summary.loading = false; state.summary.error = action.payload as string; });

        // Monthly Target
        builder.addCase(fetchMonthlyTarget.pending, (state) => { state.monthlyTarget.loading = true; state.monthlyTarget.error = null; });
        builder.addCase(fetchMonthlyTarget.fulfilled, (state, action) => { state.monthlyTarget.loading = false; state.monthlyTarget.data = action.payload; });
        builder.addCase(fetchMonthlyTarget.rejected, (state, action) => { state.monthlyTarget.loading = false; state.monthlyTarget.error = action.payload as string; });

        // Sales Chart
        builder.addCase(fetchSalesChart.pending, (state) => { state.salesChart.loading = true; state.salesChart.error = null; });
        builder.addCase(fetchSalesChart.fulfilled, (state, action) => { state.salesChart.loading = false; state.salesChart.data = action.payload; });
        builder.addCase(fetchSalesChart.rejected, (state, action) => { state.salesChart.loading = false; state.salesChart.error = action.payload as string; });

        // Performance Chart
        builder.addCase(fetchPerformanceChart.pending, (state) => { state.performanceChart.loading = true; state.performanceChart.error = null; });
        builder.addCase(fetchPerformanceChart.fulfilled, (state, action) => { state.performanceChart.loading = false; state.performanceChart.data = action.payload; });
        builder.addCase(fetchPerformanceChart.rejected, (state, action) => { state.performanceChart.loading = false; state.performanceChart.error = action.payload as string; });

        // Recent Orders
        builder.addCase(fetchRecentOrders.pending, (state) => { state.recentOrders.loading = true; state.recentOrders.error = null; });
        builder.addCase(fetchRecentOrders.fulfilled, (state, action) => { state.recentOrders.loading = false; state.recentOrders.data = action.payload; });
        builder.addCase(fetchRecentOrders.rejected, (state, action) => { state.recentOrders.loading = false; state.recentOrders.error = action.payload as string; });

        // Demographics
        builder.addCase(fetchDemographics.pending, (state) => { state.demographics.loading = true; state.demographics.error = null; });
        builder.addCase(fetchDemographics.fulfilled, (state, action) => {
            state.demographics.loading = false;
            state.demographics.data = action.payload.demographics;
            state.demographics.stateData = action.payload.stateDemographics;
        });
        builder.addCase(fetchDemographics.rejected, (state, action) => { state.demographics.loading = false; state.demographics.error = action.payload as string; });

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

        // Master Loader
        builder.addCase(loadDashboardSequentially.pending, (state) => { state.isDashboardLoading = true; });
        builder.addCase(loadDashboardSequentially.fulfilled, (state) => { state.isDashboardLoading = false; });
        builder.addCase(loadDashboardSequentially.rejected, (state) => { state.isDashboardLoading = false; });
    },
});

export const { setMetricsPeriods, setSalesChartYear, setPerformanceRange, clearDashboardState, clearReport } = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;
