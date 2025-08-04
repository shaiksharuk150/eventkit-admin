"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import ExcelJS from 'exceljs'
import { Visitor } from "../data"
import { formatDateForExcel, formatTimeForExcel } from "../utils/date-utils"

interface ExcelDownloaderProps {
  visitors: Visitor[]
  userData?: any
}

export default function ExcelDownloader({ visitors, userData }: ExcelDownloaderProps) {
  const downloadExcel = async () => {
    if (!visitors || visitors.length === 0) {
      alert('No visitors data to download')
      return
    }

    // Process visitor data for Excel
    const processedData = visitors.map((visitor) => {
      return {
        'Visitor Name': visitor.Name || 'N/A',
        'Email': visitor.Email || 'N/A',
        'Mobile': visitor.Mobile ? `${visitor.countryCode || '+91'} ${visitor.Mobile}` : 'N/A',
        'Event': visitor.Event || 'N/A',
        'Status': visitor.Status || 'N/A',
        'Location': visitor.location || 'N/A',
        'Type': visitor.intype || 'N/A',
        'Date': formatDateForExcel(visitor.Date),
        'Time': formatTimeForExcel(visitor.Date),
        'Assigned To': visitor.assignedToObj?.name || 'Unassigned',
        'Assigned Email': visitor.assignedToObj?.email || 'N/A',
        'Project ID': visitor.ProjectId || 'N/A',
        'Notes': visitor.Note || 'N/A',
        'Schedule': visitor.schedule || 'N/A',
        'Organization': userData?.orgName || 'N/A',
        'Organization ID': userData?.orgId || 'N/A'
      }
    })

    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Visitors Data')

    // Get headers from the first row
    const headers = Object.keys(processedData[0] || {})

    // Add headers to worksheet
    worksheet.addRow(headers)

    // Add data rows
    processedData.forEach((row) => {
      const rowData = headers.map((header) => row[header])
      worksheet.addRow(rowData)
    })

    // Style headers (first row)
    const headerRow = worksheet.getRow(1)
    headerRow.height = 25
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2563EB' }, // Blue background
      }
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' }, // White text
        size: 12
      }
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
      }
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF1E40AF' } },
        bottom: { style: 'thin', color: { argb: 'FF1E40AF' } },
        left: { style: 'thin', color: { argb: 'FF1E40AF' } },
        right: { style: 'thin', color: { argb: 'FF1E40AF' } },
      }
    })

    // Set column widths
    headers.forEach((header, index) => {
      const column = worksheet.getColumn(index + 1)
      switch (header) {
        case 'Visitor Name':
          column.width = 25
          break
        case 'Email':
          column.width = 30
          break
        case 'Mobile':
          column.width = 18
          break
        case 'Event':
          column.width = 30
          break
        case 'Status':
          column.width = 15
          break
        case 'Location':
          column.width = 20
          break
        case 'Type':
          column.width = 12
          break
        case 'Date':
          column.width = 15
          break
        case 'Time':
          column.width = 12
          break
        case 'Assigned To':
          column.width = 20
          break
        case 'Assigned Email':
          column.width = 25
          break
        case 'Project ID':
          column.width = 15
          break
        case 'Notes':
          column.width = 40
          break
        case 'Schedule':
          column.width = 20
          break
        case 'Organization':
          column.width = 25
          break
        case 'Organization ID':
          column.width = 18
          break
        default:
          column.width = 15
      }
    })

    // Style data rows
    for (let rowIndex = 2; rowIndex <= worksheet.rowCount; rowIndex++) {
      const row = worksheet.getRow(rowIndex)
      row.height = 20
      row.eachCell((cell, colNumber) => {
        const header = headers[colNumber - 1]

        // Add borders to all cells
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        }

        // Center align headers and status
        if (header === 'Status' || header === 'Type' || header === 'Date' || header === 'Time') {
          cell.alignment = { horizontal: 'center' }
        }

        // Right align mobile numbers
        if (header === 'Mobile') {
          cell.alignment = { horizontal: 'right' }
        }

        // Conditional formatting for Status column
        if (header === 'Status' && cell.value) {
          const status = cell.value.toString().toLowerCase()
          if (status === 'new') {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFDBEAFE' }, // Light blue
            }
            cell.font = { color: { argb: 'FF1E40AF' }, bold: true }
          } else if (status === 'confirmed') {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFD1FAE5' }, // Light green
            }
            cell.font = { color: { argb: 'FF065F46' }, bold: true }
          } else if (status === 'contacted') {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFEF3C7' }, // Light yellow
            }
            cell.font = { color: { argb: 'FF92400E' }, bold: true }
          } else if (status === 'cancelled') {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFEE2E2' }, // Light red
            }
            cell.font = { color: { argb: 'FF991B1B' }, bold: true }
          }
        }

        // Highlight important columns
        if (header === 'Visitor Name') {
          cell.font = { bold: true }
        }
        if (header === 'Event') {
          cell.font = { bold: true }
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF8FAFC' }, // Very light blue
          }
        }
        if (header === 'Assigned To') {
          cell.font = { bold: true }
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF1F5F9' }, // Light gray
          }
        }
      })
    }

    // Generate filename
    const timestamp = new Date().toISOString().slice(0, 10)
    const orgName = userData?.orgName?.replace(/\s+/g, '_') || 'Visitors'
    const filename = `${orgName}_Visitors_${timestamp}.xlsx`

    // Download the file
    try {
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading Excel file:', error)
      alert('Error downloading Excel file. Please try again.')
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={downloadExcel}
      className="flex items-center space-x-2"
      disabled={!visitors || visitors.length === 0}
    >
      <Download className="h-4 w-4" />
      <span>Export Excel</span>
    </Button>
  )
} 