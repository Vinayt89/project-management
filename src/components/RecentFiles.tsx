
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface RecentFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedDate: string;
  projectId?: string;
}

const RecentFiles: React.FC = () => {
  const recentFiles: RecentFile[] = [
    {
      id: '1',
      name: 'Project Requirements.pdf',
      type: 'PDF',
      size: '2.4 MB',
      uploadedBy: 'John Smith',
      uploadedDate: '2024-04-25',
      projectId: '1'
    },
    {
      id: '2',
      name: 'Design Mockups.figma',
      type: 'Figma',
      size: '15.2 MB',
      uploadedBy: 'Sarah Brown',
      uploadedDate: '2024-04-24',
      projectId: '2'
    },
    {
      id: '3',
      name: 'Meeting Notes.docx',
      type: 'Word',
      size: '450 KB',
      uploadedBy: 'Michael Lee',
      uploadedDate: '2024-04-23',
      projectId: '1'
    },
    {
      id: '4',
      name: 'Budget Spreadsheet.xlsx',
      type: 'Excel',
      size: '1.1 MB',
      uploadedBy: 'Emily Davis',
      uploadedDate: '2024-04-22',
      projectId: '3'
    }
  ];

  const getFileIcon = (type: string) => {
    return <FileText className="w-4 h-4 text-blue-500" />;
  };

  const handleViewFile = (fileId: string) => {
    console.log('Viewing file:', fileId);
  };

  const handleDownloadFile = (fileId: string) => {
    console.log('Downloading file:', fileId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Files</CardTitle>
        <CardDescription>Latest uploaded documents</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentFiles.map(file => (
          <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              {getFileIcon(file.type)}
              <div>
                <p className="font-medium text-sm">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {file.size} • {file.uploadedBy} • {new Date(file.uploadedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleViewFile(file.id)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownloadFile(file.id)}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentFiles;
