"use client";

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { loadDashboardSequentially } from "@/redux/features/adminDashboardSlice";

export const DashboardInit = () => {
    const dispatch = useDispatch<AppDispatch>();
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            dispatch(loadDashboardSequentially());
        }
    }, [dispatch]);

    return null;
};
