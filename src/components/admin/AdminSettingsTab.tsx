import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Settings, Map, HelpCircle, Instagram, Sparkles, Plus, Pencil, Trash2,
  Save, X, Eye, EyeOff, ExternalLink, GripVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ContentLoading } from '@/components/ui/loading-spinner';

const FAQ_CATEGORIES = [
  { id: 'booking', label: 'Booking & Payments' },
  { id: 'tours', label: 'Tours & Customization' },
  { id: 'visas', label: 'Visas & Travel Requirements' },
  { id: 'cancellations', label: 'Cancellations & Refunds' },
  { id: 'general', label: 'General Questions' },
];

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
}

interface InstagramImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  is_active: boolean;
}

interface SiteSettings {
  instagram_profile_url: string;
  trip_planner_enabled: boolean;
  instagram_feed_enabled: boolean;
}

interface Tour {
  id: string;
  name: string;
  map_coordinates: any;
}

export function AdminSettingsTab() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Settings state
  const [settings, setSettings] = useState<SiteSettings>({
    instagram_profile_url: 'https://instagram.com/voyageslanka',
    trip_planner_enabled: true,
    instagram_feed_enabled: true,
  });

  // FAQ state
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [faqDialogOpen, setFaqDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [faqForm, setFaqForm] = useState({ category: 'general', question: '', answer: '' });

  // Instagram state
  const [instagramImages, setInstagramImages] = useState<InstagramImage[]>([]);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<InstagramImage | null>(null);
  const [imageForm, setImageForm] = useState({ image_url: '', alt_text: '' });

  // Tours for map coordinates
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [mapCoordinates, setMapCoordinates] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // Fetch settings
      const { data: settingsData } = await supabase
        .from('site_settings')
        .select('key, value');

      if (settingsData) {
        const newSettings = { ...settings };
        settingsData.forEach(s => {
          if (s.key === 'instagram_profile_url') newSettings.instagram_profile_url = s.value || '';
          if (s.key === 'trip_planner_enabled') newSettings.trip_planner_enabled = s.value === 'true';
          if (s.key === 'instagram_feed_enabled') newSettings.instagram_feed_enabled = s.value === 'true';
        });
        setSettings(newSettings);
      }

      // Fetch FAQs
      const { data: faqData } = await supabase
        .from('faq_entries')
        .select('*')
        .order('display_order', { ascending: true });
      if (faqData) setFaqs(faqData);

      // Fetch Instagram images
      const { data: imageData } = await supabase
        .from('instagram_images')
        .select('*')
        .order('display_order', { ascending: true });
      if (imageData) setInstagramImages(imageData);

      // Fetch tours for map editing
      const { data: tourData } = await supabase
        .from('tours')
        .select('id, name, map_coordinates');
      if (tourData) setTours(tourData);

    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load settings', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // Settings handlers
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const updates = [
        { key: 'instagram_profile_url', value: settings.instagram_profile_url },
        { key: 'trip_planner_enabled', value: settings.trip_planner_enabled.toString() },
        { key: 'instagram_feed_enabled', value: settings.instagram_feed_enabled.toString() },
      ];

      for (const update of updates) {
        await supabase
          .from('site_settings')
          .update({ value: update.value })
          .eq('key', update.key);
      }

      toast({ title: 'Settings Saved', description: 'Your settings have been updated.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  // FAQ handlers
  const handleSaveFaq = async () => {
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      toast({ title: 'Error', description: 'Question and answer are required', variant: 'destructive' });
      return;
    }

    try {
      if (editingFaq) {
        await supabase
          .from('faq_entries')
          .update({
            category: faqForm.category,
            question: faqForm.question,
            answer: faqForm.answer
          })
          .eq('id', editingFaq.id);
      } else {
        await supabase
          .from('faq_entries')
          .insert([{
            category: faqForm.category,
            question: faqForm.question,
            answer: faqForm.answer,
            display_order: faqs.length
          }]);
      }

      toast({ title: editingFaq ? 'FAQ Updated' : 'FAQ Created' });
      setFaqDialogOpen(false);
      setEditingFaq(null);
      setFaqForm({ category: 'general', question: '', answer: '' });
      fetchAllData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save FAQ', variant: 'destructive' });
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Delete this FAQ entry?')) return;
    await supabase.from('faq_entries').delete().eq('id', id);
    toast({ title: 'FAQ Deleted' });
    fetchAllData();
  };

  const handleToggleFaq = async (faq: FAQ) => {
    await supabase
      .from('faq_entries')
      .update({ is_active: !faq.is_active })
      .eq('id', faq.id);
    fetchAllData();
  };

  // Instagram image handlers
  const handleSaveImage = async () => {
    if (!imageForm.image_url.trim()) {
      toast({ title: 'Error', description: 'Image URL is required', variant: 'destructive' });
      return;
    }

    try {
      if (editingImage) {
        await supabase
          .from('instagram_images')
          .update({
            image_url: imageForm.image_url,
            alt_text: imageForm.alt_text
          })
          .eq('id', editingImage.id);
      } else {
        await supabase
          .from('instagram_images')
          .insert([{
            image_url: imageForm.image_url,
            alt_text: imageForm.alt_text,
            display_order: instagramImages.length
          }]);
      }

      toast({ title: editingImage ? 'Image Updated' : 'Image Added' });
      setImageDialogOpen(false);
      setEditingImage(null);
      setImageForm({ image_url: '', alt_text: '' });
      fetchAllData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save image', variant: 'destructive' });
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    await supabase.from('instagram_images').delete().eq('id', id);
    toast({ title: 'Image Deleted' });
    fetchAllData();
  };

  const handleToggleImage = async (image: InstagramImage) => {
    await supabase
      .from('instagram_images')
      .update({ is_active: !image.is_active })
      .eq('id', image.id);
    fetchAllData();
  };

  // Map coordinates handler
  const handleSaveMapCoordinates = async () => {
    if (!selectedTour) return;

    try {
      const coordinates = mapCoordinates ? JSON.parse(mapCoordinates) : null;
      await supabase
        .from('tours')
        .update({ map_coordinates: coordinates })
        .eq('id', selectedTour.id);

      toast({ title: 'Map Coordinates Saved' });
      fetchAllData();
    } catch (error) {
      toast({ title: 'Error', description: 'Invalid JSON format', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return <ContentLoading text="Loading settings..." />;
  }

  return (
    <div className="space-y-8">
      {/* Feature Toggles */}
      <div className="bg-card p-6 rounded-xl border border-border">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-sunset" />
          <h2 className="font-serif text-xl font-bold">Feature Settings</h2>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Trip Planner</p>
              <p className="text-sm text-muted-foreground">Enable the smart trip planner page</p>
            </div>
            <Switch
              checked={settings.trip_planner_enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, trip_planner_enabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Instagram Feed</p>
              <p className="text-sm text-muted-foreground">Show Instagram inspiration on homepage</p>
            </div>
            <Switch
              checked={settings.instagram_feed_enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, instagram_feed_enabled: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label>Instagram Profile URL</Label>
            <Input
              value={settings.instagram_profile_url}
              onChange={(e) => setSettings({ ...settings, instagram_profile_url: e.target.value })}
              placeholder="https://instagram.com/yourusername"
            />
          </div>

          <Button onClick={handleSaveSettings} disabled={isSaving} variant="ocean">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      {/* FAQ Management */}
      <div className="bg-card p-6 rounded-xl border border-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-sunset" />
            <h2 className="font-serif text-xl font-bold">FAQ Management</h2>
          </div>
          <Button
            variant="ocean"
            size="sm"
            onClick={() => { setEditingFaq(null); setFaqForm({ category: 'general', question: '', answer: '' }); setFaqDialogOpen(true); }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add FAQ
          </Button>
        </div>

        {faqs.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No FAQ entries yet.</p>
        ) : (
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map(faq => (
              <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <Badge variant="outline" className="text-xs capitalize">{faq.category}</Badge>
                    <span className={faq.is_active ? '' : 'text-muted-foreground line-through'}>{faq.question}</span>
                    {!faq.is_active && <Badge variant="secondary" className="text-xs">Hidden</Badge>}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground mb-4">{faq.answer}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => {
                      setEditingFaq(faq);
                      setFaqForm({ category: faq.category, question: faq.question, answer: faq.answer });
                      setFaqDialogOpen(true);
                    }}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleToggleFaq(faq)}>
                      {faq.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteFaq(faq.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      {/* Instagram Images */}
      <div className="bg-card p-6 rounded-xl border border-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Instagram className="w-5 h-5 text-sunset" />
            <h2 className="font-serif text-xl font-bold">Instagram Images</h2>
          </div>
          <Button
            variant="ocean"
            size="sm"
            onClick={() => { setEditingImage(null); setImageForm({ image_url: '', alt_text: '' }); setImageDialogOpen(true); }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Image
          </Button>
        </div>

        {instagramImages.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No images yet. Default images will be shown.</p>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {instagramImages.map(image => (
              <div key={image.id} className="relative group">
                <Image
                  src={image.image_url}
                  alt={image.alt_text || ''}
                  fill
                  className={`object-cover rounded-lg ${!image.is_active ? 'opacity-50' : ''}`}
                  sizes="150px"
                />
                <div className="absolute inset-0 bg-ocean-dark/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-sand" onClick={() => {
                    setEditingImage(image);
                    setImageForm({ image_url: image.image_url, alt_text: image.alt_text || '' });
                    setImageDialogOpen(true);
                  }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-sand" onClick={() => handleToggleImage(image)}>
                    {image.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-sand" onClick={() => handleDeleteImage(image.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tour Map Coordinates */}
      <div className="bg-card p-6 rounded-xl border border-border">
        <div className="flex items-center gap-2 mb-6">
          <Map className="w-5 h-5 text-sunset" />
          <h2 className="font-serif text-xl font-bold">Tour Map Coordinates</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Tour</Label>
            <Select
              value={selectedTour?.id || ''}
              onValueChange={(id) => {
                const tour = tours.find(t => t.id === id);
                setSelectedTour(tour || null);
                setMapCoordinates(tour?.map_coordinates ? JSON.stringify(tour.map_coordinates, null, 2) : '');
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a tour to edit" />
              </SelectTrigger>
              <SelectContent>
                {tours.map(tour => (
                  <SelectItem key={tour.id} value={tour.id}>
                    {tour.name}
                    {tour.map_coordinates && <Badge className="ml-2 text-xs">Has Map</Badge>}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTour && (
            <>
              <div className="space-y-2">
                <Label>Map Coordinates (JSON)</Label>
                <Textarea
                  value={mapCoordinates}
                  onChange={(e) => setMapCoordinates(e.target.value)}
                  placeholder='[{"lat": 7.2906, "lng": 80.6337, "name": "Kandy", "type": "start"}]'
                  rows={8}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Format: Array of objects with lat, lng, name, and optional type (start/destination/stop)
                </p>
              </div>
              <Button onClick={handleSaveMapCoordinates} variant="ocean">
                <Save className="w-4 h-4 mr-2" />
                Save Coordinates
              </Button>
            </>
          )}
        </div>
      </div>

      {/* FAQ Dialog */}
      <Dialog open={faqDialogOpen} onOpenChange={setFaqDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFaq ? 'Edit FAQ' : 'Add FAQ'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={faqForm.category} onValueChange={(v) => setFaqForm({ ...faqForm, category: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FAQ_CATEGORIES.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Question</Label>
              <Input
                value={faqForm.question}
                onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                placeholder="Enter the question"
              />
            </div>
            <div className="space-y-2">
              <Label>Answer</Label>
              <Textarea
                value={faqForm.answer}
                onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                placeholder="Enter the answer"
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveFaq} variant="ocean" className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {editingFaq ? 'Update' : 'Create'}
              </Button>
              <Button variant="outline" onClick={() => setFaqDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingImage ? 'Edit Image' : 'Add Image'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={imageForm.image_url}
                onChange={(e) => setImageForm({ ...imageForm, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label>Alt Text (optional)</Label>
              <Input
                value={imageForm.alt_text}
                onChange={(e) => setImageForm({ ...imageForm, alt_text: e.target.value })}
                placeholder="Description for accessibility"
              />
            </div>
            {imageForm.image_url && (
              <img
                src={imageForm.image_url}
                alt="Preview"
                className="w-full h-32 object-cover rounded-lg"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            )}
            <div className="flex gap-2">
              <Button onClick={handleSaveImage} variant="ocean" className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {editingImage ? 'Update' : 'Add'}
              </Button>
              <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
