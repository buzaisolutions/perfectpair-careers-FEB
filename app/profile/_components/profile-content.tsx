'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Save, 
  Linkedin
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast' 
import { motion } from 'framer-motion'

interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  linkedinUrl: string
  coverLetter: string
  phoneNumber: string
  address: string
  city: string
  country: string
  professionalTitle: string
  summary: string
}

interface Document {
  id: string
  fileName: string
  originalFileName: string
  fileType: string
  fileSize: number
  createdAt: string
}

export function ProfileContent() {
  const { data: session, update } = useSession()
  const { toast } = useToast()
  const router = useRouter()
  
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    linkedinUrl: '',
    coverLetter: '',
    phoneNumber: '',
    address: '',
    city: '',
    country: '',
    professionalTitle: '',
    summary: ''
  })

  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchProfile()
    fetchDocuments()
  }, [])

  useEffect(() => {
    if (session?.user && !formData.email) {
      setFormData(prev => ({
        ...prev,
        email: session.user.email || '',
        firstName: prev.firstName || session.user.firstName || session.user.name?.split(' ')[0] || '',
        lastName: prev.lastName || session.user.lastName || session.user.name?.split(' ').slice(1).join(' ') || '',
      }))
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setFormData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            linkedinUrl: data.linkedinUrl || '',
            coverLetter: data.coverLetter || '',
            phoneNumber: data.phoneNumber || '',
            address: data.address || '',
            city: data.city || '',
            country: data.country || '',
            professionalTitle: data.professionalTitle || '',
            summary: data.summary || ''
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents')
      if (response.ok) {
        const data = await response.json()
        setDocuments(data?.documents || [])
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await update({
            ...session,
            user: {
                ...session?.user,
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                firstName: formData.firstName,
                lastName: formData.lastName
            }
        })

        toast({
          title: 'Profile updated!',
          description: 'Your information has been saved successfully.',
        })
        
        router.refresh()
      } else {
        throw new Error('Error saving profile')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save profile. Please try again.',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      toast({
        variant: 'destructive',
        title: 'Invalid format',
        description: 'Please upload PDF or DOCX files only.',
      })
      return
    }

    if (file.size > 10 * 1024 * 1024) { 
      toast({
        variant: 'destructive',
        title: 'File too large',
        description: 'File must be at most 10MB.',
      })
      return
    }

    setUploading(true)

    try {
      const formDate = new FormData()
      formDate.append('file', file)

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formDate,
      })

      if (response.ok) {
        toast({
          title: 'Upload successful!',
          description: 'Your document has been uploaded successfully.',
        })
        fetchDocuments()
      } else {
        const error = await response.json()
        throw new Error(error?.error || 'Upload error')
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      toast({
        variant: 'destructive',
        title: 'Upload error',
        description: error?.message || 'Could not upload the file.',
      })
    } finally {
      setUploading(false)
      if (event.target) {
        event.target.value = ''
      }
    }
  }

  const handleDeleteDocument = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Document deleted',
          description: 'The document has been removed successfully.',
        })
        fetchDocuments()
      } else {
        throw new Error('Error deleting document')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not delete the document.',
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-48 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-2 text-lg text-gray-600">
              Manage your personal information and documents
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Complete your profile for more personalized optimizations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="bg-white"
                          placeholder="John"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="bg-white"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={formData.email}
                        disabled
                        className="bg-gray-100 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500">Email cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="professionalTitle">Professional Title</Label>
                      <Input
                        id="professionalTitle"
                        placeholder="e.g. Frontend Developer, Project Manager"
                        value={formData.professionalTitle}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="linkedinUrl">
                        <Linkedin className="inline mr-1 h-4 w-4" />
                        LinkedIn URL
                      </Label>
                      <Input
                        id="linkedinUrl"
                        placeholder="https://www.linkedin.com/in/your-profile"
                        value={formData.linkedinUrl}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone</Label>
                        <Input
                          id="phoneNumber"
                          placeholder="+31 6 12345678"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          placeholder="Netherlands"
                          value={formData.country}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="Amsterdam"
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          placeholder="Street, number"
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="summary">Professional Summary</Label>
                      <Textarea
                        id="summary"
                        placeholder="Briefly describe your experience and professional goals..."
                        rows={4}
                        value={formData.summary}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="coverLetter">Default Cover Letter</Label>
                      <Textarea
                        id="coverLetter"
                        placeholder="Write a cover letter that will be used as a base for optimizations..."
                        rows={6}
                        value={formData.coverLetter}
                        onChange={handleChange}
                      />
                      <p className="text-xs text-gray-500">
                        This letter will be automatically personalized for each job
                      </p>
                    </div>

                    <Button type="submit" disabled={saving} className="w-full">
                      {saving ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Profile
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    My Documents
                  </CardTitle>
                  <CardDescription>
                    Upload your resumes in PDF or DOCX
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".pdf,.docx"
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                    <label 
                      htmlFor="file-upload" 
                      className={`cursor-pointer ${uploading ? 'pointer-events-none opacity-50' : ''}`}
                    >
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        {uploading ? 'Uploading...' : 'Click to upload or drag files here'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF or DOCX up to 10MB
                      </p>
                    </label>
                  </div>

                  {documents && documents.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Uploaded Documents</h4>
                      {documents.map((doc) => (
                        <div
                          key={doc?.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded">
                              <FileText className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {doc?.originalFileName}
                              </p>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Badge variant="outline" className="text-xs">
                                  {doc?.fileType}
                                </Badge>
                                <span>{formatFileSize(doc?.fileSize || 0)}</span>
                                <span>•</span>
                                <span>
                                  {doc?.createdAt ? new Date(doc.createdAt).toLocaleDateString('en-US') : 'Date not available'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`/api/documents/${doc?.id}/download`, '_blank')}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteDocument(doc?.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <FileText className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        No documents uploaded yet
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}