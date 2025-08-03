import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Globe, Upload, Play, Heart, MessageCircle, Trophy, Video, Star, ThumbsUp, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import VideoPlayer from "@/components/VideoPlayer";

interface ContestSubmission {
  id: string;
  userName: string;
  language: string;
  region: string;
  caption: string;
  videoUrl: string;
  thumbnailUrl?: string;
  votes: number;
  rating: number;
  views: number;
  comments: number;
  createdAt: Date;
  isLiked?: boolean;
}

const LANGUAGES = [
  "Spanish", "French", "German", "Italian", "Portuguese", "Russian",
  "Chinese", "Japanese", "Korean", "Arabic", "Hindi", "Dutch"
];

const REGIONS = [
  "North America", "South America", "Europe", "Asia", "Africa", "Oceania"
];

export default function Contests() {
  const { toast } = useToast();
  const { user, isAuthenticated, logout } = useAuth();
  const [submissions, setSubmissions] = useState<ContestSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    language: "",
    region: "",
    caption: "",
    videoFile: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      
      // Mock contest submissions with video data
      const mockSubmissions: ContestSubmission[] = [
        {
          id: "1",
          userName: "Sofia Martinez",
          language: "Spanish",
          region: "South America",
          caption: "Practicing Spanish pronunciation with my favorite song! 🎵",
          videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          thumbnailUrl: "https://images.unsplash.com/photo-1494790108755-2616c9e31d76?w=400&h=300&fit=crop",
          votes: 127,
          rating: 4.8,
          views: 1450,
          comments: 23,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          isLiked: false
        },
        {
          id: "2", 
          userName: "Liu Wei",
          language: "Chinese",
          region: "Asia",
          caption: "Learning Mandarin through traditional poetry recitation 📚",
          videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
          thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
          votes: 95,
          rating: 4.6,
          views: 980,
          comments: 18,
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
          isLiked: true
        },
        {
          id: "3",
          userName: "Emma Johnson",
          language: "French",
          region: "North America",
          caption: "Bonjour! Sharing my French conversation practice from Montreal 🇫🇷",
          videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
          thumbnailUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop",
          votes: 83,
          rating: 4.4,
          views: 756,
          comments: 12,
          createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
          isLiked: false
        }
      ];

      // Add user's submission if they exist (checking localStorage for recent submission)
      if (user) {
        const recentSubmission = localStorage.getItem(`user_submission_${user.id}`);
        if (recentSubmission) {
          try {
            const submissionData = JSON.parse(recentSubmission);
            const userSubmission: ContestSubmission = {
              id: `user-${user.id}`,
              userName: user.name,
              language: submissionData.language || user.targetLanguages[0] || "Spanish",
              region: submissionData.region || "Your Region",
              caption: submissionData.caption || "My language learning progress - thanks LanguageKonnect! 🌟",
              videoUrl: submissionData.videoUrl || "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
              thumbnailUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop",
              votes: 0, // Always start with 0 votes for new submissions
              rating: 0, // Always start with 0 rating
              views: 0, // Start with 0 views
              comments: 0, // Start with 0 comments
              createdAt: new Date(submissionData.createdAt || Date.now()),
              isLiked: false
            };
            mockSubmissions.push(userSubmission);
          } catch (error) {
            console.error('Error parsing user submission:', error);
          }
        }
      }

      // Sort by votes (descending)
      mockSubmissions.sort((a, b) => b.votes - a.votes);
      setSubmissions(mockSubmissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to load contest submissions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to submit your video",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (!formData.language || !formData.region || !formData.caption || !formData.videoFile) {
        throw new Error("Please fill in all fields and select a video");
      }

      const response = await api.submitContestEntry({
        language: formData.language,
        region: formData.region,
        caption: formData.caption,
        videoFile: formData.videoFile
      });

      // Store user's submission in localStorage for immediate display
      if (user) {
        const submissionData = {
          language: formData.language,
          region: formData.region,
          caption: formData.caption,
          videoUrl: response.videoUrl || "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          createdAt: new Date().toISOString()
        };
        localStorage.setItem(`user_submission_${user.id}`, JSON.stringify(submissionData));
      }

      toast({
        title: "✅ Video submitted!",
        description: "Your contest entry has been uploaded successfully!",
      });

      // Reset form and close dialog
      setFormData({
        language: "",
        region: "",
        caption: "",
        videoFile: null
      });
      setUploadDialogOpen(false);

      // Refresh submissions
      fetchSubmissions();

    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload video",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (submissionId: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Login Required",
        description: "Please login to vote",
        variant: "destructive"
      });
      return;
    }

    try {
      const currentSubmission = submissions.find(s => s.id === submissionId);
      if (!currentSubmission) return;

      const action = currentSubmission.isLiked ? 'unlike' : 'like';

      // Call voting API
      const response = await api.voteOnEntry(submissionId, user.id, action);

      // Update votes with real response
      setSubmissions(prev => prev.map(submission =>
        submission.id === submissionId
          ? {
              ...submission,
              votes: response.votes,
              isLiked: response.isLiked
            }
          : submission
      ));

      toast({
        title: "Vote Recorded!",
        description: "Thanks for voting! Your support helps the community grow.",
      });
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: "Failed to record vote. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-purple-50/30">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                LanguageKonnect
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/leaderboard">
                <Button variant="ghost" aria-label="Go to leaderboard">Leaderboard</Button>
              </Link>
              <Link to="/referrals">
                <Button variant="ghost" aria-label="Go to referrals">Referrals</Button>
              </Link>
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Welcome, </span>
                    <span className="font-medium">{user?.name}</span>
                  </div>
                  <Button variant="outline" onClick={logout} aria-label="Logout">
                    Logout
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button variant="outline" aria-label="Login to LanguageKonnect">Login</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Video className="w-8 h-8 text-primary mr-3" />
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                Language Contests
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
              Upload 60-second videos showcasing your language skills and vote for your favorites!
            </p>
            
            {/* Upload Button */}
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="text-lg px-8 py-3" aria-label="Upload contest video">
                  <Upload className="mr-2 h-5 w-5" />
                  Submit Your Video
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Submit Contest Entry</DialogTitle>
                  <DialogDescription>
                    Upload your 60-second language video and join the competition!
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language *</Label>
                      <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                        <SelectTrigger aria-label="Select language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGES.map((lang) => (
                            <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="region">Region *</Label>
                      <Select value={formData.region} onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}>
                        <SelectTrigger aria-label="Select region">
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {REGIONS.map((region) => (
                            <SelectItem key={region} value={region}>{region}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="caption">Caption *</Label>
                    <Textarea
                      id="caption"
                      value={formData.caption}
                      onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
                      placeholder="Describe your video and language learning journey..."
                      maxLength={200}
                      aria-label="Enter video caption"
                    />
                    <div className="text-sm text-muted-foreground text-right">
                      {formData.caption.length}/200
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="video">Video File (MP4 only, max 60 seconds) *</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <Input
                        id="video"
                        type="file"
                        accept="video/mp4"
                        onChange={(e) => setFormData(prev => ({ ...prev, videoFile: e.target.files?.[0] || null }))}
                        className="hidden"
                        aria-label="Upload video file"
                      />
                      <Label htmlFor="video" className="cursor-pointer">
                        {formData.videoFile ? (
                          <div>
                            <p className="font-medium text-primary">{formData.videoFile.name}</p>
                            <p className="text-sm text-muted-foreground">Click to change file</p>
                          </div>
                        ) : (
                          <div>
                            <p className="font-medium">Click to upload video</p>
                            <p className="text-sm text-muted-foreground">MP4 format, max 60 seconds</p>
                          </div>
                        )}
                      </Label>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button type="button" variant="outline" onClick={() => setUploadDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Uploading..." : "Submit Entry"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Contest Submissions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Latest Submissions</h2>
              <Button variant="outline" onClick={fetchSubmissions} disabled={loading}>
                {loading ? "Loading..." : "Refresh"}
              </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-video bg-muted rounded-t-lg"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : submissions.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
                  <p className="text-muted-foreground mb-4">Be the first to upload a contest video!</p>
                  <Button onClick={() => setUploadDialogOpen(true)}>
                    Submit First Video
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {submissions.map((submission) => (
                  <Card key={submission.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <VideoPlayer
                        src={submission.videoUrl}
                        thumbnail={submission.thumbnailUrl}
                        title={`${submission.userName} - ${submission.caption}`}
                        className="rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-black/70 text-white">
                          {getTimeAgo(submission.createdAt)}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{submission.userName}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs">{submission.language}</Badge>
                            <span>•</span>
                            <span>{submission.region}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{submission.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {submission.caption}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{submission.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{submission.comments}</span>
                          </div>
                        </div>
                        
                        <Button
                          variant={submission.isLiked ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleVote(submission.id)}
                          className="flex items-center gap-1"
                          aria-label={submission.isLiked ? "Unlike video" : "Like video"}
                        >
                          <ThumbsUp className={`w-4 h-4 ${submission.isLiked ? 'fill-current' : ''}`} />
                          <span>{submission.votes}</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Call to Action */}
          {!isAuthenticated && (
            <Card className="mt-12 text-center bg-gradient-to-r from-primary/10 to-accent/10">
              <CardContent className="py-12">
                <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Join the Competition!</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Create your account to upload videos, vote for favorites, and climb the leaderboard!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/signup">
                    <Button size="lg">Sign Up Now</Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg">Login</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
