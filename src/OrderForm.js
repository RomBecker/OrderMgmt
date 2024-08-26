import React, { useState, useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Typography, Grid, TextField, Select, MenuItem,
    Button, Paper, Box, InputLabel, FormControl, Divider
} from '@mui/material';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';

const RTLTextField = (props) => (
    <TextField
        {...props}
        InputProps={{
            ...props.InputProps,
            style: { textAlign: 'right' },
        }}
        inputProps={{
            ...props.inputProps,
            style: { textAlign: 'right', direction: 'rtl' },
        }}
    />
);

function OrderForm() {
    const createRow = () => ({
        currency: '₪',
        total: 0,
        unitPrice: 0,
        quantity: 0,
        itemDescription: '',
        itemId: '',
        budget: ''
    });

    const [tableData, setTableData] = useState([createRow()]);

    const { control, handleSubmit } = useForm({
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
        }
    });

    const onSubmit = (data) => {
        console.log({ ...data, orderItems: tableData });
        // Handle form submission here
    };

    const budgetOptions = ['Budget 1', 'Budget 2', 'Budget 3'];
    const budgetOwnerOptions = ['Owner 1', 'Owner 2', 'Owner 3'];

    const [totals, setTotals] = useState({
        priceWithoutTax: 0,
        tax: 0,
        finalPrice: 0
    });

    useEffect(() => {
        const priceWithoutTax = tableData.reduce((sum, row) => sum + (parseFloat(row.total) || 0), 0);
        const tax = priceWithoutTax * 0.17;
        const finalPrice = priceWithoutTax + tax;
        setTotals({
            priceWithoutTax: priceWithoutTax.toFixed(2),
            tax: tax.toFixed(2),
            finalPrice: finalPrice.toFixed(2)
        });
    }, [tableData]);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'currency',
                header: 'מטבע',
                editVariant: 'select',
                editSelectOptions: ['₪', '$'],
                size: 100,
                Edit: ({ cell, column, row, table }) => (
                    <Select
                        value={cell.getValue()}
                        onChange={(e) => {
                            setTableData((prev) =>
                                prev.map((item, index) =>
                                    index === row.index ? { ...item, [column.id]: e.target.value } : item
                                )
                            );
                        }}
                        fullWidth
                        sx={{ '& .MuiSelect-select': { textAlign: 'right' } }}
                    >
                        {['₪', '$'].map((option) => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                    </Select>
                ),
            },
            {
                accessorKey: 'total',
                header: 'סה"כ',
                Edit: ({ cell, column, row, table }) => (
                    <RTLTextField
                        value={cell.getValue()}
                        onChange={(e) => {
                            const newValue = parseFloat(e.target.value) || 0;
                            setTableData((prev) =>
                                prev.map((item, index) =>
                                    index === row.index
                                        ? {
                                            ...item,
                                            [column.id]: newValue,
                                            unitPrice: item.quantity !== 0 ? newValue / item.quantity : 0
                                          }
                                        : item
                                )
                            );
                        }}
                        type="number"
                        fullWidth
                    />
                ),
            },
            {
                accessorKey: 'unitPrice',
                header: 'מחיר ליחידה',
                Edit: ({ cell, column, row, table }) => (
                    <RTLTextField
                        value={cell.getValue()}
                        onChange={(e) => {
                            const newValue = parseFloat(e.target.value) || 0;
                            setTableData((prev) =>
                                prev.map((item, index) =>
                                    index === row.index
                                        ? {
                                            ...item,
                                            [column.id]: newValue,
                                            total: newValue * item.quantity
                                          }
                                        : item
                                )
                            );
                        }}
                        type="number"
                        fullWidth
                    />
                ),
            },
            {
                accessorKey: 'quantity',
                header: 'כמות',
                Edit: ({ cell, column, row, table }) => (
                    <RTLTextField
                        value={cell.getValue()}
                        onChange={(e) => {
                            const newValue = parseInt(e.target.value) || 0;
                            setTableData((prev) =>
                                prev.map((item, index) =>
                                    index === row.index
                                        ? {
                                            ...item,
                                            [column.id]: newValue,
                                            total: item.unitPrice * newValue
                                          }
                                        : item
                                )
                            );
                        }}
                        type="number"
                        fullWidth
                    />
                ),
            },
            {
                accessorKey: 'itemDescription',
                header: 'תיאור פריט',
                Edit: ({ cell, column, row, table }) => (
                    <RTLTextField
                        value={cell.getValue()}
                        onChange={(e) => {
                            const newValue = e.target.value;
                            setTableData((prev) =>
                                prev.map((item, index) =>
                                    index === row.index ? { ...item, [column.id]: newValue } : item
                                )
                            );
                        }}
                        fullWidth
                    />
                ),
            },
            {
                accessorKey: 'itemId',
                header: 'מזהה פריט',
                Edit: ({ cell, column, row, table }) => (
                    <RTLTextField
                        value={cell.getValue()}
                        onChange={(e) => {
                            const newValue = e.target.value;
                            setTableData((prev) =>
                                prev.map((item, index) =>
                                    index === row.index ? { ...item, [column.id]: newValue } : item
                                )
                            );
                        }}
                        fullWidth
                    />
                ),
            },
            {
                accessorKey: 'budget',
                header: 'תקציב',
                editVariant: 'select',
                editSelectOptions: budgetOptions,
                Edit: ({ cell, column, row, table }) => (
                    <Select
                        value={cell.getValue()}
                        onChange={(e) => {
                            setTableData((prev) =>
                                prev.map((item, index) =>
                                    index === row.index ? { ...item, [column.id]: e.target.value } : item
                                )
                            );
                        }}
                        fullWidth
                        sx={{ '& .MuiSelect-select': { textAlign: 'right' } }}
                    >
                        {budgetOptions.map((option) => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                    </Select>
                ),
            },
        ],
        [budgetOptions, setTableData]
    );

    const table = useMaterialReactTable({
        columns,
        data: tableData,
        enableEditing: true,
        columnResizeDirection: 'rtl',
        editDisplayMode: 'cell',
        muiTableBodyCellEditTextFieldProps: {
            variant: 'outlined',
            InputProps: {
                sx: {
                    textAlign: 'right',
                    direction: 'rtl',
                }
            },
        },
        renderRowActions: ({ row }) => (
            <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={() => {
                    setTableData((prev) =>
                        prev.filter((_, index) => index !== row.index)
                    );
                }}
            >
                מחק
            </Button>
        ),
        renderTopToolbarCustomActions: () => (
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    setTableData((prev) => [createRow(), ...prev]);
                }}
            >
                הוסף שורה חדשה
            </Button>
        ),
        muiTableBodyCellProps: {
            align: 'right',
            sx: {
                display: 'flex !important',
                flexDirection: 'column !important',
                alignItems: 'flex-end !important',
                justifyContent: 'center !important',
                textAlign: 'right !important',
                '& .MuiInputBase-root': {
                    width: '100%',
                    '& input': {
                        textAlign: 'right',
                        direction: 'rtl',
                    }
                },
                '& .MuiSelect-select': {
                    textAlign: 'right',
                },
            },
        },
        muiTableHeadCellProps: {
            align: 'right',
            sx: {
                display: 'flex !important',
                flexDirection: 'column !important',
                alignItems: 'flex-end !important',
                justifyContent: 'center !important',
                textAlign: 'right !important',
            },
        },
        layoutMode: 'grid',
        muiTablePaperProps: {
            sx: {
                '& .MuiTablePagination-root': {
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    left: '-260%',
                },
                '& .MuiTablePagination-actions': {
                    marginLeft: 'auto',
                    marginRight: 0,
                },
                '& .MuiTablePagination-select': {
                    marginLeft: '8px',
                    marginRight: '32px',
                },
                '& .MuiTablePagination-selectLabel': {
                    marginLeft: '8px',
                },
                '& .MuiTablePagination-displayedRows': {
                    marginRight: '32px',
                },
            },
        },
        muiTablePaginationProps: {
            rowsPerPageOptions: [10, 20, 30, 50],
            labelRowsPerPage: "שורות לעמוד:",
            labelDisplayedRows: ({ from, to, count }) => `${from}-${to} מתוך ${count}`,
        },

        muiTopToolbarProps: {
            sx: {
                justifyContent: 'flex-end',
                flexDirection: 'row',
            },
        },
        muiBottomToolbarProps: {
            sx: {
                justifyContent: 'flex-end',
                flexDirection: 'row',
            },
        },
        positionActionsColumn: 'first',
        enableColumnResizing: false,
        enableColumnOrdering: false,
        enableSorting: false,
        enableColumnActions: false,
        enableColumnFilters: false,
        enableColumnFilterModes: false,
        enableHiding: false,
        enableDensityToggle: false,
        enableFullScreenToggle: false,
        defaultColumn: {
            minSize: 40,
            maxSize: 200,
            size: 120,
        },
        localization: {
            actions: 'פעולות',
            rowsPerPage: 'שורות לעמוד',
            rowsSelected: 'שורות נבחרו',
        },
    });

    return (
        <Box sx={{ my: 4, direction: 'rtl' }}>
            <Typography variant="h4" align="center" gutterBottom color="primary">
            ניהול הזמנה
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    <Grid container spacing={3}>
                        {/* Section 2 */}
                        <Grid item xs={12} md={6}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Controller
                                        name="nameOfReceiver"
                                        control={control}
                                        render={({ field }) => <RTLTextField {...field} label="שם המקבל" fullWidth />}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Controller
                                        name="building"
                                        control={control}
                                        render={({ field }) => <RTLTextField {...field} label="בניין" fullWidth />}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Controller
                                        name="destinedFor"
                                        control={control}
                                        render={({ field }) => <RTLTextField {...field} label="מיועד ל" fullWidth />}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Controller
                                        name="roomAndFloor"
                                        control={control}
                                        render={({ field }) => <RTLTextField {...field} label="חדר וקומה" fullWidth />}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Controller
                                        name="date"
                                        control={control}
                                        render={({ field }) => <RTLTextField {...field} label="תאריך" fullWidth type="date" InputLabelProps={{ shrink: true }} />}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Controller
                                        name="phoneNumber"
                                        control={control}
                                        render={({ field }) => <RTLTextField {...field} label="מספר טלפון" fullWidth />}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Section 1 */}
                        <Grid item xs={12} md={6}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Controller
                                        name="requirementNumber"
                                        control={control}
                                        render={({ field }) => <RTLTextField {...field} label="מספר דרישה" fullWidth />}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Controller
                                        name="orderNumber"
                                        control={control}
                                        render={({ field }) => <RTLTextField {...field} label="מספר הזמנה" fullWidth />}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>תקציב</InputLabel>
                                        <Controller
                                            name="budget"
                                            control={control}
                                            render={({ field }) => (
                                                <Select {...field} label="תקציב">
                                                    {budgetOptions.map((option) => (
                                                        <MenuItem key={option} value={option}>{option}</MenuItem>
                                                    ))}
                                                </Select>
                                            )}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>בעל התקציב</InputLabel>
                                        <Controller
                                            name="budgetOwner"
                                            control={control}
                                            render={({ field }) => (
                                                <Select {...field} label="בעל התקציב">
                                                    {budgetOwnerOptions.map((option) => (
                                                        <MenuItem key={option} value={option}>{option}</MenuItem>
                                                    ))}
                                                </Select>
                                            )}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="supplierNameAndAddress"
                                        control={control}
                                        render={({ field }) => <RTLTextField {...field} label="שם וכתובת הספק" fullWidth multiline rows={2} />}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Section 3 */}
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" color="primary">
                            פריטי הזמנה
                        </Typography>
                    </Box>
                    <MaterialReactTable table={table} />
                </Paper>

                {/* Section 3.5 and Comments */}
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 3, mb: 3, height: '100%', marginBottom: '-7px'}}>
                            <Typography variant="h6" color="primary" gutterBottom textAlign="end">
                                סיכום
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Grid container spacing={2} sx={{ direction: 'rtl' }}>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle1">₪{totals.priceWithoutTax}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle1" align="left">:מחיר (ללא מע"מ) </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle1"> ₪{totals.tax}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle1" align="left">:מע"מ (17%)</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle1" fontWeight="bold"> ₪{totals.finalPrice}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle1" align="left" fontWeight="bold">:מחיר סופי</Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 3, mb: 3, height: '100%', marginBottom: '-7px' }}>
                            <Controller
                                name="comments"
                                control={control}
                                render={({ field }) => <RTLTextField {...field} label="הערות" fullWidth multiline rows={6} />}
                            />
                        </Paper>
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginTop: '20px'}}>
                    <Button type="submit" variant="contained" color="primary" size="large">
                        שלח הזמנה
                    </Button>
                </Box>
            </form>
        </Box>
    );
}

export default OrderForm;