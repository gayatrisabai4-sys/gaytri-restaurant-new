import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createReservation } from '@/db/api';
import { toast } from 'sonner';
import { CheckCircle2, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface ReservationForm {
  customer_name: string;
  date: string;
  time: string;
  number_of_people: number;
}

export default function ReservationPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<ReservationForm>({
    defaultValues: {
      customer_name: '',
      date: '',
      time: '',
      number_of_people: 1,
    },
  });

  const onSubmit = async (data: ReservationForm) => {
    // Validate future date
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      form.setError('date', { message: 'Please select a future date' });
      return;
    }

    setSubmitting(true);

    const reservation = await createReservation({
      customer_name: data.customer_name,
      date: data.date,
      time: data.time,
      number_of_people: data.number_of_people,
    });

    if (reservation) {
      setSuccess(true);
      toast.success('Reservation confirmed!');
      form.reset();
    } else {
      toast.error('Failed to create reservation. Please try again.');
    }

    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-2xl">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <CheckCircle2 className="mb-4 h-16 w-16 text-secondary" />
              <h2 className="mb-2 text-2xl font-bold text-foreground">Reservation Confirmed!</h2>
              <p className="mb-6 text-muted-foreground">
                Thank you for your reservation. We look forward to serving you!
              </p>
              <div className="flex gap-4">
                <Button onClick={() => setSuccess(false)}>Make Another Reservation</Button>
                <Button variant="outline" onClick={() => (window.location.href = '/')}>
                  Go to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <Calendar className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h1 className="mb-2 text-4xl font-bold text-foreground">Table Reservation</h1>
            <p className="text-muted-foreground">
              Reserve your table and enjoy an authentic Indian dining experience
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Reservation Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="customer_name"
                    rules={{ required: 'Full name is required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    rules={{ required: 'Date is required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    rules={{ required: 'Time is required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="number_of_people"
                    rules={{
                      required: 'Number of people is required',
                      min: { value: 1, message: 'Minimum 1 person required' },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of People</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={e => field.onChange(Number.parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Reservation'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
