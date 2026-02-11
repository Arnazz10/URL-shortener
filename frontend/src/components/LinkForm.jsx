
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { api } from '../services/api';

export default function LinkForm({ onSubmit, initialData, isEdit, onClose }) {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: initialData || { isActive: true },
    });

    const submitHandler = async (data) => {
        setLoading(true);
        await onSubmit(data);
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all scale-100 animate-scale-up border border-gray-100 p-6">
                <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {isEdit ? 'Update Link' : 'Create New Link'}
                </h2>

                <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Destination URL</label>
                        <input
                            type="url"
                            className={`input-field mt-1 ${errors.originalUrl ? 'border-red-500' : ''}`}
                            placeholder="https://example.com/very-long-url"
                            {...register('originalUrl', {
                                required: 'Wait, we need a URL!',
                                pattern: {
                                    value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                                    message: "Please enter a valid URL"
                                }
                            })}
                        />
                        {errors.originalUrl && <p className="text-red-500 text-xs mt-1">{errors.originalUrl.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Custom Alias (Opt)</label>
                            <input
                                type="text"
                                className="input-field mt-1"
                                placeholder="my-link"
                                {...register('customAlias', {
                                    pattern: {
                                        value: /^[a-zA-Z0-9-_]+$/,
                                        message: "Only letters, numbers, dashes"
                                    }
                                })}
                            />
                            {errors.customAlias && <p className="text-red-500 text-xs mt-1">{errors.customAlias.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Expires At (Opt)</label>
                            <input
                                type="datetime-local"
                                className="input-field mt-1"
                                {...register('expiresAt')}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password (Opt)</label>
                        <input
                            type="password"
                            className="input-field mt-1"
                            placeholder="Secret access code"
                            {...register('password')}
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary px-6 py-2 shadow-lg hover:shadow-blue-500/30 text-sm"
                        >
                            {loading ? 'Processing...' : (isEdit ? 'Save Changes' : 'Create Link')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
