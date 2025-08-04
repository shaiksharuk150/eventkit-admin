"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  MoreHorizontal, 
  Search, 
  Filter, 
  Download,
  Eye,
  Edit,
  Phone,
  Mail,
  Calendar,
  MapPin,
  User,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Plus
} from "lucide-react"
import { Visitor } from "../data"
import ExcelDownloader from "./excel-downloader"

const columns: ColumnDef<Visitor>[] = [
  {
    accessorKey: "Name",
    header: ({ column }) => {
      return (
        <div className="group flex items-center cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <span className="font-semibold">Name</span>
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )
    },
    cell: ({ row }) => {
      const name = row.getValue("Name") as string
      const initial = name?.charAt(0)?.toUpperCase() || "?"
      
      // Generate consistent color based on name
      const colors = [
        'bg-gradient-to-r from-emerald-500 to-emerald-600',
        'bg-gradient-to-r from-purple-500 to-purple-600',
        'bg-gradient-to-r from-orange-500 to-orange-600',
        'bg-gradient-to-r from-red-500 to-red-600',
        'bg-gradient-to-r from-yellow-500 to-yellow-600',
        'bg-gradient-to-r from-indigo-500 to-indigo-600',
        'bg-gradient-to-r from-pink-500 to-pink-600',
        'bg-gradient-to-r from-teal-500 to-teal-600',
        'bg-gradient-to-r from-amber-500 to-amber-600',
        'bg-gradient-to-r from-cyan-500 to-cyan-600',
      ]
      
      const colorIndex = name?.charCodeAt(0) % colors.length || 0
      const avatarColor = colors[colorIndex]
      
      return (
        <div className="flex items-center space-x-3">
          <div className={`h-8 w-8 rounded-full ${avatarColor} flex items-center justify-center`}>
            <span className="text-white text-sm font-medium">
              {initial}
            </span>
          </div>
          <div className="font-medium">{name}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "Mobile",
    header: ({ column }) => {
      return (
        <div className="group flex items-center cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <span className="font-semibold">Phone</span>
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )
    },
    cell: ({ row }) => (
      <div className="text-sm">
        {row.original.countryCode || "+91"}{row.original.Mobile || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "Event",
    header: ({ column }) => {
      return (
        <div className="group flex items-center cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <span className="font-semibold">Event</span>
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )
    },
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("Event")}</div>
    ),
  },
  {
    accessorKey: "Date",
    header: ({ column }) => {
      return (
        <div className="group flex items-center cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <span className="font-semibold">Date & Time</span>
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("Date") as number
      if (date) {
        const dateObj = new Date(date)
        return (
          <div className="text-sm">
            <div className="font-medium">
              {dateObj.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </div>
            <div className="text-xs text-gray-500">
              {dateObj.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </div>
          </div>
        )
      }
      return <div className="text-sm text-gray-400">N/A</div>
    },
  },
  {
    accessorKey: "Status",
    header: ({ column }) => {
      return (
        <div className="group flex items-center cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <span className="font-semibold">Status</span>
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )
    },
    cell: ({ row }) => {
      const status = row.getValue("Status") as string
      const getStatusBadge = (status: string) => {
        switch (status?.toLowerCase()) {
          case 'new':
            return 'bg-green-100 text-green-800 border-green-200'
          case 'contacted':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200'
          case 'confirmed':
            return 'bg-emerald-100 text-emerald-800 border-emerald-200'
          case 'cancelled':
            return 'bg-red-100 text-red-800 border-red-200'
          default:
            return 'bg-gray-100 text-gray-800 border-gray-200'
        }
      }
      return (
        <Badge className={`text-xs border ${getStatusBadge(status)}`}>
          {status || "Unknown"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "Note",
    header: ({ column }) => {
      return (
        <div className="group flex items-center cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <span className="font-semibold">Note</span>
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )
    },
    cell: ({ row }) => (
      <div className="text-sm text-gray-600 max-w-48 truncate" title={row.getValue("Note") || "No notes"}>
        {row.getValue("Note") || "No notes"}
      </div>
    ),
  },
]

interface VisitorsTableProps {
  data: Visitor[]
  userData?: any
}

export function VisitorsTable({ data, userData }: VisitorsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [searchKey, setSearchKey] = React.useState("")
  const [filteredData, setFilteredData] = React.useState(data)

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  React.useEffect(() => {
    setFilteredData(data)
  }, [data])

  const searchKeyField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchString = e.target.value
    setSearchKey(searchString)

    if (searchString === '' || !searchString) {
      setFilteredData(data)
    } else {
      const filtered = data.filter((item) => {
        return (
          item?.Email?.toLowerCase().includes(searchString.toLowerCase()) ||
          item?.Mobile?.toLowerCase().includes(searchString.toLowerCase()) ||
          item?.Name?.toLowerCase().includes(searchString.toLowerCase()) ||
          item?.Event?.toLowerCase().includes(searchString.toLowerCase()) ||
          item?.Status?.toLowerCase().includes(searchString.toLowerCase()) ||
          item?.intype?.toLowerCase().includes(searchString.toLowerCase())
        )
      })
      setFilteredData(filtered)
    }
  }

  const handleRowClick = (row: Visitor) => {
    console.log('Clicked row:', row)
    // Add your row click handler here
  }

  return (
    <div className="w-full">
      {/* Enhanced Toolbar */}
      <section className="flex flex-row justify-between pb-2 py-1 rounded px-3 bg-gray-50 mb-1">
        <span className="flex flex-row">
          <span className="relative p-1 border rounded h-8 mt-1">
            <Search className="h-3 w-3 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search visitors..."
              onChange={searchKeyField}
              value={searchKey}
              className="ml-6 bg-transparent w-96 text-xs focus:border-transparent focus:ring-0 focus-visible:border-transparent focus-visible:ring-0 focus:outline-none"
            />
          </span>
        </span>

        <span className="flex">
          <div className="pt-1 flex items-center gap-2">
            <ExcelDownloader visitors={filteredData} userData={userData} />
          </div>
        </span>
      </section>

      {/* Table Container */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50 h-10">
              <TableRow>
                <TableHead className="text-center text-gray-700 h-10 max-h-10 leading-10 max-w-12 min-w-6 px-3 mr-2">
                  <span className="text-black font-medium whitespace-nowrap">S.No</span>
                </TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  headerGroup.headers.map((header) => {
                    return (
                      <TableHead 
                        key={header.id} 
                        className="text-gray-700 font-semibold text-gray-700 h-10 max-h-10 leading-10 border-l-0 border-r-0"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(row.original)}
                  >
                    <TableCell className="text-center h-10 max-h-10 leading-10 max-w-12 min-w-6 px-3 mr-2">
                      {index + 1}
                    </TableCell>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id} 
                        className="py-2 h-10 max-h-10 leading-10 border-l-0 border-r-0"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="h-32 text-center"
                  >
                    <div className="text-gray-400">No visitors found</div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Showing {filteredData.length} of {data.length} visitors
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
} 