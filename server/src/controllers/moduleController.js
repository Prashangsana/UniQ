const Module = require('../models/Module');
const User = require('../models/User');

exports.getModules = async (req, res) => {
  try {
    const modules = await Module.find()
      .populate('moduleLeaders', 'name email')
      .populate('moduleTeam', 'name email');
    res.status(200).json({ success: true, modules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createModule = async (req, res) => {
  try {
    const { _id, name, moduleLeaders, moduleTeam } = req.body;
    
    const newModule = await Module.create({ 
      _id, 
      name, 
      moduleLeaders, 
      moduleTeam: moduleTeam || [] 
    });
    
    await newModule.populate('moduleLeaders', 'name email');
    await newModule.populate('moduleTeam', 'name email');
    
    res.status(201).json({ success: true, module: newModule });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Module Code already exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Module function
exports.updateModule = async (req, res) => {
  try {
    const originalId = req.params.id;
    const { newId, name, moduleLeaders, moduleTeam } = req.body;

    if (originalId !== newId) {
      // Create the new module
      const updatedModule = await Module.create({
        _id: newId,
        name,
        moduleLeaders,
        moduleTeam: moduleTeam || []
      });

      await Module.findByIdAndDelete(originalId);
      await updatedModule.populate('moduleLeaders', 'name email');
      await updatedModule.populate('moduleTeam', 'name email');
      return res.status(200).json({ success: true, module: updatedModule });
    }

    const updatedModule = await Module.findByIdAndUpdate(
      originalId, 
      { name, moduleLeaders, moduleTeam },
      { new: true }
    )
    .populate('moduleLeaders', 'name email')
    .populate('moduleTeam', 'name email');

    res.status(200).json({ success: true, module: updatedModule });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "New Module Code already exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Module function
exports.deleteModule = async (req, res) => {
  try {
    const moduleId = req.params.id;
    
    const deletedModule = await Module.findByIdAndDelete(moduleId);
    
    if (!deletedModule) {
      return res.status(404).json({ success: false, message: "Module not found" });
    }

    await User.updateMany(
      { modules: deletedModule.name }, 
      { $pull: { modules: deletedModule.name } }
    );

    res.status(200).json({ 
      success: true, 
      message: "Module removed successfully." 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};