import { Sparkles, Globe, MessageSquare, Link as LinkIcon, Heart, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-[#020617] pt-20 pb-10 border-t border-slate-800/60 overflow-hidden mt-auto">
            {/* Background Glows */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-6 group">
                            <div className="p-2 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-black text-white tracking-tight">Learning Bench</span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
                            The ultimate AI-powered study kit and knowledge hub for the next generation of creators and learners.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="p-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all group">
                                <Globe size={18} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="#" className="p-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-all group">
                                <LinkIcon size={18} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="#" className="p-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 hover:text-sky-400 hover:border-sky-500/50 transition-all group">
                                <MessageSquare size={18} className="group-hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6">Platform</h4>
                        <ul className="space-y-4">
                            <li><Link to="/tools" className="text-slate-400 text-sm font-medium hover:text-cyan-400 transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" /> Study Tools</Link></li>
                            <li><Link to="/blogs" className="text-slate-400 text-sm font-medium hover:text-cyan-400 transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" /> Knowledge Hub</Link></li>
                            <li><Link to="/creator-registration" className="text-slate-400 text-sm font-medium hover:text-cyan-400 transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" /> Become a Creator</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6">Resources</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-slate-400 text-sm font-medium hover:text-purple-400 transition-colors">Help Center</a></li>
                            <li><a href="#" className="text-slate-400 text-sm font-medium hover:text-purple-400 transition-colors">Community Guidelines</a></li>
                            <li><a href="#" className="text-slate-400 text-sm font-medium hover:text-purple-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-slate-400 text-sm font-medium hover:text-purple-400 transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>

                    {/* Newsletter / Contact */}
                    <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6">Stay Updated</h4>
                        <p className="text-slate-400 text-sm mb-4 font-medium">Join our newsletter for the latest study tips and tech updates.</p>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                                />
                            </div>
                            <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-cyan-600/20">
                                Subscribe
                            </button>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm font-medium">
                        &copy; {currentYear} Learning Bench. All rights reserved.
                    </p>
                    <p className="text-slate-500 text-sm font-medium flex items-center gap-1.5">
                        Built with <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> by Malaka Prasad
                    </p>
                </div>
            </div>
        </footer>
    );
}