import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Trophy, Filter, Star, Users, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface LeaderboardEntry {
  id: string;
  userName: string;
  score: number;
  rank: number;
  language?: string;
  region?: string;
  caption?: string;
  rating?: number;
  createdAt?: Date;
}

export default function Leaderboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, logout } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'votes' | 'recent' | 'rating'>('votes');
  const [filterLanguage, setFilterLanguage] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const filters: any = { sortBy };
      if (filterLanguage && filterLanguage !== 'all') filters.language = filterLanguage;
      if (filterRegion && filterRegion !== 'all') filters.region = filterRegion;
      
      const data = await api.getContestLeaderboard(filters);

      // Add authenticated user to leaderboard if they have submitted a contest entry
      let updatedData = [...data];
      if (isAuthenticated && user) {
        const userExists = data.some(entry => entry.userName === user.name);
        if (!userExists) {
          // Check if user has a contest submission
          const recentSubmission = localStorage.getItem(`user_submission_${user.id}`);
          if (recentSubmission) {
            try {
              const submissionData = JSON.parse(recentSubmission);
              const userEntry: LeaderboardEntry = {
                id: user.id,
                userName: user.name,
                score: 0, // Start with 0 votes for new submissions
                rank: 0, // Will be calculated below
                language: submissionData.language || user.targetLanguages[0] || "Spanish",
                region: submissionData.region || "Your Region",
                caption: submissionData.caption || "My language learning journey!",
                rating: 0, // Start with 0 rating
                createdAt: new Date(submissionData.createdAt || user.joinedAt)
              };
              updatedData.push(userEntry);
            } catch (error) {
              console.error('Error parsing user submission for leaderboard:', error);
            }
          }
        }
      }

      // Sort by score and assign ranks
      updatedData.sort((a, b) => b.score - a.score);
      updatedData = updatedData.map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));

      setLeaderboardData(updatedData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast({
        title: "Error",
        description: "Failed to load leaderboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [sortBy, filterLanguage, filterRegion]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchLeaderboard, 300000);
    return () => clearInterval(interval);
  }, [sortBy, filterLanguage, filterRegion]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Star className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Star className="w-5 h-5 text-orange-500" />;
    return <span className="w-5 h-5 flex items-center justify-center text-muted-foreground font-semibold">{rank}</span>;
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-yellow-600";
    if (rank === 2) return "bg-gradient-to-r from-gray-300 to-gray-500";
    if (rank === 3) return "bg-gradient-to-r from-orange-400 to-orange-600";
    return "bg-muted";
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
              <Link to="/contests">
                <Button variant="ghost" aria-label="Go to contests">Contests</Button>
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
              <Trophy className="w-8 h-8 text-primary mr-3" />
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                Contest Leaderboard
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See who's leading in our language contests. Compete, vote, and climb the ranks!
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{leaderboardData.length}</div>
                <div className="text-muted-foreground">Active Contestants</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  {leaderboardData.reduce((sum, entry) => sum + entry.score, 0)}
                </div>
                <div className="text-muted-foreground">Total Votes</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Globe className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  {new Set(leaderboardData.map(entry => entry.language)).size}
                </div>
                <div className="text-muted-foreground">Languages</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                <CardTitle>Filters & Sorting</CardTitle>
              </div>
              <CardDescription>
                Filter and sort the leaderboard to find specific competitions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger aria-label="Sort leaderboard by">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="votes">Most Votes</SelectItem>
                      <SelectItem value="rating">Highest Rating</SelectItem>
                      <SelectItem value="recent">Most Recent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Language</label>
                  <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                    <SelectTrigger aria-label="Filter by language">
                      <SelectValue placeholder="All Languages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Languages</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="Japanese">Japanese</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                      <SelectItem value="Chinese">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Region</label>
                  <Select value={filterRegion} onValueChange={setFilterRegion}>
                    <SelectTrigger aria-label="Filter by region">
                      <SelectValue placeholder="All Regions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      <SelectItem value="North America">North America</SelectItem>
                      <SelectItem value="South America">South America</SelectItem>
                      <SelectItem value="Europe">Europe</SelectItem>
                      <SelectItem value="Asia">Asia</SelectItem>
                      <SelectItem value="Africa">Africa</SelectItem>
                      <SelectItem value="Oceania">Oceania</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <Button 
                  variant="outline" 
                  onClick={fetchLeaderboard}
                  disabled={loading}
                  aria-label="Refresh leaderboard data"
                >
                  {loading ? "Loading..." : "Refresh"}
                </Button>
                <div className="text-sm text-muted-foreground">
                  Auto-refreshes every 5 minutes
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Live Rankings
              </CardTitle>
              <CardDescription>
                Real-time contest results updated instantly
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading leaderboard...</p>
                </div>
              ) : leaderboardData.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No contest entries found</p>
                  <Link to="/contests">
                    <Button className="mt-4" aria-label="Submit your first contest entry">
                      Submit Your First Entry
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {leaderboardData.map((entry, index) => (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-colors hover:bg-muted/50 ${
                        entry.rank <= 3 ? 'bg-gradient-to-r from-primary/5 to-accent/5' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getRankBadgeColor(entry.rank)}`}>
                          {getRankIcon(entry.rank)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{entry.userName}</h3>
                            {entry.rank <= 3 && (
                              <Badge variant="secondary" className="text-xs">
                                Top {entry.rank}
                              </Badge>
                            )}
                          </div>
                          {entry.caption && (
                            <p className="text-sm text-muted-foreground mb-2">"{entry.caption}"</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {entry.language && (
                              <Badge variant="outline" className="text-xs">
                                {entry.language}
                              </Badge>
                            )}
                            {entry.region && (
                              <Badge variant="outline" className="text-xs">
                                {entry.region}
                              </Badge>
                            )}
                            {entry.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span>{entry.rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{entry.score}</div>
                        <div className="text-sm text-muted-foreground">votes</div>
                        {index < leaderboardData.length - 1 && entry.score > leaderboardData[index + 1]?.score && (
                          <ArrowUp className="w-4 h-4 text-green-600 mx-auto mt-1" />
                        )}
                        {index > 0 && entry.score < leaderboardData[index - 1]?.score && (
                          <ArrowDown className="w-4 h-4 text-red-600 mx-auto mt-1" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center mt-8">
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6">
                <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ready to Compete?</h3>
                <p className="text-muted-foreground mb-4">
                  Upload your 60-second language video and join the competition!
                </p>
                <Link to="/contests">
                  <Button className="w-full" aria-label="Submit contest entry">
                    Submit Your Entry
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
