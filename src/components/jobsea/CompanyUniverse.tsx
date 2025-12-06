import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Building2, ExternalLink, Star, Download, Filter, Info, Briefcase, Target, DollarSign } from "lucide-react";

interface CompanyUniverseProps {
  profile: any;
}

export default function CompanyUniverse({ profile }: CompanyUniverseProps) {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();
  const PAGE_SIZE = 20;

  useEffect(() => {
    fetchCompanies();
  }, [page, searchQuery, sectorFilter]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('jobsea_companies')
        .select('*', { count: 'exact' })
        .order('hiring_velocity', { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

      // Apply user-controlled filters (search and sector dropdown)
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      if (sectorFilter && sectorFilter !== 'all') {
        query = query.eq('sector', sectorFilter);
      }

      // Build preference-based filters (more lenient - prioritize rather than restrict)
      const preferenceFilters: string[] = [];
      
      // Prefer companies in user's geography
      if (profile?.geography) {
        preferenceFilters.push(`geography.eq.${profile.geography}`);
      }

      // Prefer companies in user's target industries
      if (profile?.branches && profile.branches.length > 0) {
        profile.branches.forEach((branch: string) => {
          preferenceFilters.push(`sector.ilike.%${branch}%`);
        });
      }

      // Only apply preference filters if we have them AND no manual filters
      // This ensures we show ALL companies if user is searching/filtering manually
      if (preferenceFilters.length > 0 && !searchQuery && sectorFilter === 'all') {
        query = query.or(preferenceFilters.join(','));
      }

      const { data, error, count } = await query;

      if (error) throw error;

      setCompanies(data || []);
      setTotalPages(Math.ceil((count || 0) / PAGE_SIZE));
    } catch (error: any) {
      console.error('Error fetching companies:', error);
      toast({
        title: "Error",
        description: "Failed to load companies",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCompany = (companyId: string) => {
    setSelectedCompanies(prev =>
      prev.includes(companyId)
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleAddToWatchlist = async () => {
    if (selectedCompanies.length === 0) {
      toast({
        title: "No companies selected",
        description: "Please select companies to add to your watchlist",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const inserts = selectedCompanies.map(companyId => ({
        user_id: user.id,
        company_id: companyId
      }));

      const { error } = await supabase
        .from('jobsea_user_companies')
        .upsert(inserts, { onConflict: 'user_id,company_id' });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Added ${selectedCompanies.length} companies to watchlist`,
      });

      setSelectedCompanies([]);
    } catch (error: any) {
      console.error('Error adding to watchlist:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add companies",
        variant: "destructive"
      });
    }
  };

  const handleExportCSV = () => {
    const csv = [
      ['Company', 'Sector', 'Headcount', 'Open Jobs', 'Glassdoor Rating', 'Hiring Velocity', 'LinkedIn URL'].join(','),
      ...companies.map(c => 
        [c.name, c.sector, c.headcount, c.open_jobs, c.glassdoor_rating, c.hiring_velocity, c.linkedin_url].join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jobsea-companies-${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Companies exported to CSV",
    });
  };

  const uniqueSectors = [...new Set(companies.map(c => c.sector))];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Universe
            </CardTitle>
            <CardDescription>
              Top companies ranked by hiring velocity and culture fit
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={companies.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              size="sm"
              onClick={handleAddToWatchlist}
              disabled={selectedCompanies.length === 0}
            >
              <Star className="h-4 w-4 mr-2" />
              Add to Watchlist ({selectedCompanies.length})
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select value={sectorFilter} onValueChange={(value) => {
            setSectorFilter(value);
            setPage(1);
          }}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              {uniqueSectors.map(sector => (
                <SelectItem key={sector} value={sector}>{sector}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading companies...</p>
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <p className="text-muted-foreground font-medium">No companies found</p>
            <p className="text-sm text-muted-foreground">
              {searchQuery || sectorFilter !== 'all' 
                ? 'Try adjusting your search or sector filter' 
                : 'Complete the onboarding quiz to get personalized recommendations'}
            </p>
            {(searchQuery || sectorFilter !== 'all') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSectorFilter('all');
                  setPage(1);
                }}
                className="mt-4"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Select</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Headcount</TableHead>
                    <TableHead className="text-right">Open Jobs</TableHead>
                    <TableHead className="text-right">Rating</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow key={company.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedCompanies.includes(company.id)}
                          onCheckedChange={() => handleToggleCompany(company.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium" onClick={() => {
                        setSelectedCompany(company);
                        setIsDetailsOpen(true);
                      }}>
                        <div className="flex items-center gap-2">
                          {company.logo && (
                            <img src={company.logo} alt={company.name} className="h-6 w-6 rounded" />
                          )}
                          <div>
                            <div>{company.name}</div>
                            <div className="text-xs text-muted-foreground">{company.geography}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell onClick={() => {
                        setSelectedCompany(company);
                        setIsDetailsOpen(true);
                      }}>
                        <Badge variant="secondary">{company.sector}</Badge>
                      </TableCell>
                      <TableCell className="max-w-md" onClick={() => {
                        setSelectedCompany(company);
                        setIsDetailsOpen(true);
                      }}>
                        <p className="text-sm text-muted-foreground truncate">
                          {company.description || 'No description available'}
                        </p>
                      </TableCell>
                      <TableCell className="text-right" onClick={() => {
                        setSelectedCompany(company);
                        setIsDetailsOpen(true);
                      }}>
                        {company.headcount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right" onClick={() => {
                        setSelectedCompany(company);
                        setIsDetailsOpen(true);
                      }}>
                        {company.open_jobs}
                      </TableCell>
                      <TableCell className="text-right" onClick={() => {
                        setSelectedCompany(company);
                        setIsDetailsOpen(true);
                      }}>
                        <Badge variant={company.glassdoor_rating >= 4.0 ? "default" : "secondary"}>
                          {company.glassdoor_rating?.toFixed(1) || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-1 justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCompany(company);
                              setIsDetailsOpen(true);
                            }}
                            title="View Details"
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(company.linkedin_url, '_blank')}
                            title="Open LinkedIn"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>

      {/* Company Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedCompany && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  {selectedCompany.logo && (
                    <img 
                      src={selectedCompany.logo} 
                      alt={selectedCompany.name} 
                      className="h-12 w-12 rounded" 
                    />
                  )}
                  <div className="flex-1">
                    <DialogTitle className="text-2xl">{selectedCompany.name}</DialogTitle>
                    <DialogDescription className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{selectedCompany.sector}</Badge>
                      <span>•</span>
                      <span>{selectedCompany.geography}</span>
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Overview */}
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Overview
                  </h3>
                  <p className="text-muted-foreground">{selectedCompany.description}</p>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold">{selectedCompany.headcount.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Employees</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold">{selectedCompany.open_jobs}</div>
                      <div className="text-xs text-muted-foreground">Open Positions</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold">{selectedCompany.glassdoor_rating?.toFixed(1) || "N/A"}</div>
                      <div className="text-xs text-muted-foreground">Glassdoor Rating</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold">{selectedCompany.hiring_velocity.toFixed(1)}%</div>
                      <div className="text-xs text-muted-foreground">Hiring Velocity</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Mission */}
                {selectedCompany.mission && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Mission
                    </h3>
                    <p className="text-muted-foreground italic">{selectedCompany.mission}</p>
                  </div>
                )}

                {/* Values */}
                {selectedCompany.values && selectedCompany.values.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Core Values</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCompany.values.map((value: string, index: number) => (
                        <Badge key={index} variant="outline">{value}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preferred Profile */}
                {selectedCompany.preferred_profile && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Preferred Candidate Profile
                    </h3>
                    <p className="text-muted-foreground">{selectedCompany.preferred_profile}</p>
                  </div>
                )}

                {/* Salary Range */}
                {selectedCompany.salary_range && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Salary Expectations
                    </h3>
                    <p className="text-muted-foreground font-mono">{selectedCompany.salary_range}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      handleToggleCompany(selectedCompany.id);
                      setIsDetailsOpen(false);
                    }}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    {selectedCompanies.includes(selectedCompany.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.open(selectedCompany.linkedin_url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on LinkedIn
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}